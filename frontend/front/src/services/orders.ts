import { api } from "../api";

export type CreateOrderData = {
    address: string;
    phone: string;
};

export type OrderItem = {
    id: number;
    product: number;
    product_title: string;
    quantity: number;
    price: string;
};

export type Order = {
    id: number;
    address: string;
    phone: string;
    total: string;
    status: string;
    created_at: string;
    items: OrderItem[];
};

export const createOrder = async (
    data: CreateOrderData
): Promise<Order> => {
    const response = await api.post<Order>(
        "/orders/create/",
        data
    );

    return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(
        "/orders/"
    );

    return response.data;
};