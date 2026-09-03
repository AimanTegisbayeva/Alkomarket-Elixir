from django.urls import path   
from .views import (
    CategoryListAPIView,
    ProductListAPIView,
    ProductDetailAPIView,
    CartAPIView,
    CartItemCreateAPIView,
    CartItemDetailAPIView,
    OrderListAPIView,
    OrderCreateAPIView
)

urlpatterns = [
    path('categories/', CategoryListAPIView.as_view(), name='api_categories'),
    path('products/', ProductListAPIView.as_view(), name='api_products'),
    path('products/<int:pk>/', ProductDetailAPIView.as_view(), name='api_product_detail'),
    path('cart/', CartAPIView.as_view(), name='api_cart'),
    path('cart/items/', CartItemCreateAPIView.as_view(), name='api_cart_item_create'),
    path('cart/items/<int:pk>/', CartItemDetailAPIView.as_view(), name='api_cart_item_detail'),
    path('orders/', OrderListAPIView.as_view(), name='api_order_list'),
    path('orders/create/', OrderCreateAPIView.as_view(), name='api_order_create'),
    
]

