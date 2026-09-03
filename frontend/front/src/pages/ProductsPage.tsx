import { useEffect, useState } from "react";

import { getProducts } from "../services/products";
import { addToCart } from "../services/cart";

import type { Product } from "../types/types";

import "./ProductsPage.css";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error(
                    "Ошибка загрузки товаров:",
                    error
                );
            }
        };

        loadProducts();
    }, []);

    const getCategoryIcon = (category: number) => {
        switch (category) {
            case 1:
                return "🥃"; // Виски

            case 2:
                return "🍷"; // Вино

            case 3:
                return "🍺"; // Пиво

            case 4:
                return "🥃"; // Ром

            case 5:
                return "🌵"; // Текила

            default:
                return "🍷";
        }
    };

    return (
        <div className="products-page">
            <h1>Каталог товаров</h1>

            <div className="products-grid">
                {products.map((product) => (
                    <div
                        className="product-card"
                        key={product.id}
                    >
                        <div className="product-image">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                />
                            ) : (
                                getCategoryIcon(product.category)
                            )}
                        </div>

                        <h2>
                            {product.title}
                        </h2>

                        <p>
                            {product.description}
                        </p>

                        <h3>
                            {product.price} ₸
                        </h3>

                        <p>
                            В наличии: {product.stock}
                        </p>

                        {product.stock > 0 ? (
                            <button
                                onClick={() =>
                                    addToCart(product.id)
                                }
                            >
                                Добавить в корзину
                            </button>
                        ) : (
                            <button disabled>
                                Нет в наличии
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}