export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string | null;
    stock: number;
    category: number;
};

export type CartItem = {
    id: number;
    product: number;
    product_title: string;
    price: string;
    quantity: number;
    total: string;
};

export type Cart = {
    id: number;
    items: CartItem[];
    total: string;
};