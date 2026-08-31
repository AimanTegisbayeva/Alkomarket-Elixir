import api from "./api";
import type { Cart, CartItem } from "../types/types";

export const getCart = async (): Promise<Cart> => {
    const response = await api.get<Cart>("cart/");
    return response.data;
};

export const addToCart = async (
    productId: number,
    quantity: number = 1
): Promise<CartItem> => {
    const response = await api.post<CartItem>("cart/items/", {
        product: productId,
        quantity: quantity,
    });

    return response.data;
};

export const updateQuantity = async (
    itemId: number,
    quantity: number
): Promise<CartItem> => {
    const response = await api.patch<CartItem>(
        `cart/items/${itemId}/`,
        {
            quantity: quantity,
        }
    );

    return response.data;
};

export const removeFromCart = async (
    itemId: number
): Promise<void> => {
    await api.delete(`cart/items/${itemId}/`);
};