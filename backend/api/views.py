from django.db import transaction

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
    CartItemSerializer,
    OrderSerializer,
)

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
)


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class CartAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class CartItemCreateAPIView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)

        serializer.save(cart=cart)


class CartItemDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)


class OrderPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 20


class OrderListAPIView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = OrderPagination

    def get_queryset(self):
        return (
            Order.objects.filter(user=self.request.user)
            .prefetch_related("items")
            .order_by("created_at")
        )


class OrderCreateAPIView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)

        cart_items = cart.items.select_related("product").all()

        if not cart_items.exists():
            return Response(
                {"detail": "Корзина пуста."}, status=status.HTTP_400_BAD_REQUEST
            )

        address = request.data.get("address")
        phone = request.data.get("phone")
        payment_method = request.data.get("payment_method", "cash")

        if not address or not phone:
            return Response(
                {"detail": "Необходимо указать адрес и телефон."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payment_method not in ["cash", "card"]:
            return Response(
                {"detail": "Неверный способ оплаты."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(
            user=request.user,
            address=address,
            phone=phone,
            total=total,
            payment_method=payment_method,
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )

        cart.items.all().delete()

        serializer = self.get_serializer(order)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderPayAPIView(generics.GenericAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            order = Order.objects.get(
                id=pk,
                user=request.user,
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Заказ не найден."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if order.payment_method != "card":
            return Response(
                {"detail": "Этот заказ не требует оплаты картой."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.is_paid:
            return Response(
                {"detail": "Заказ уже оплачен."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.is_paid = True
        order.save(update_fields=["is_paid"])

        serializer = self.get_serializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
