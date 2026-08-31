import { api } from "../api";
import type { Product } from "../types/types";

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products/");
    return response.data;
};
