from django.contrib import admin

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
        "price",
        "stock",
    )
    list_filter = ("category",)
    search_fields = ("title",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "created_at",
    )
    search_fields = ("user__username",)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart",
        "product",
        "quantity",
    )
    list_filter = ("product",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total",
        "status",
        "payment_method",
        "is_paid",
        "created_at",
    )
    list_filter = (
        "status",
        "payment_method",
        "is_paid",
    )
    search_fields = (
        "user__username",
        "address",
        "phone",
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product",
        "quantity",
        "price",
    )
