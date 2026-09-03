import { api } from "../api";

export type Category = {
    id: number;
    name: string;
};

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories/");

    return response.data;
};