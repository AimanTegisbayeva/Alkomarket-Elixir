import { api } from "../api";

export type CreateOrderData = {
    address: string;
    phone: string;
    payment_method: "cash" | "card";
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
    payment_method: "cash" | "card";
    is_paid: boolean;
};

export type OrdersResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Order[];
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

export const getOrders = async (
    page: number = 1
): Promise<OrdersResponse> => {
    const response = await api.get<OrdersResponse>(
        `/orders/?page=${page}`
    );

    return response.data;
};

export const payOrder = async (
    orderId: number
): Promise<Order> => {
    const response = await api.post<Order>(
        `/orders/${orderId}/pay/`
    );

    return response.data;
};