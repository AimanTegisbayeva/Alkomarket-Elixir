import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProducts } from "../services/products";
import {
    getCategories,
    type Category,
} from "../services/categories";
import { addToCart } from "../services/cart";

import type { Product } from "../types/types";

import "./ProductsPage.css";

export default function CategoryProductsPage() {
    const { id } = useParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategoryProducts = async () => {
            try {
                const categoryId = Number(id);

                const [allProducts, categories] =
                    await Promise.all([
                        getProducts(),
                        getCategories(),
                    ]);

                const currentCategory = categories.find(
                    (item) => item.id === categoryId
                );

                const categoryProducts = allProducts.filter(
                    (product) =>
                        product.category === categoryId
                );

                setCategory(
                    currentCategory || null
                );

                setProducts(categoryProducts);
            } catch (error) {
                console.error(
                    "Ошибка загрузки товаров категории:",
                    error
                );

                setError(
                    "Не удалось загрузить товары."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategoryProducts();
    }, [id]);

    const getCategoryIcon = (categoryId: number) => {
        switch (categoryId) {
            case 1:
                return "🥃";

            case 2:
                return "🍷";

            case 3:
                return "🍺";

            case 4:
                return "🥃";

            case 5:
                return "🌵";

            default:
                return "🍷";
        }
    };

    if (loading) {
        return (
            <main className="products-page">
                <h1>Загрузка...</h1>
            </main>
        );
    }

    if (error) {
        return (
            <main className="products-page">
                <h1>Ошибка</h1>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="products-page">
            <h1>
                {category
                    ? category.name
                    : "Категория"}
            </h1>

            {products.length === 0 ? (
                <p>
                    В этой категории пока нет товаров.
                </p>
            ) : (
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
                                    getCategoryIcon(
                                        product.category
                                    )
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
                                В наличии:{" "}
                                {product.stock}
                            </p>

                            {product.stock > 0 ? (
                                <button
                                    onClick={() =>
                                        addToCart(
                                            product.id
                                        )
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
            )}
        </main>
    );
}

