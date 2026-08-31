import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import { addToCart } from "../services/cart";
import type { Product } from "../types/types";
import "./ProductsPage.css";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await getProducts();

                console.log("Товары из API:", data);

                setProducts(data);
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error);
                setError("Не удалось загрузить товары.");
            }
        };

        loadProducts();
    }, []);

    const handleAddToCart = async (productId: number) => {
        try {
            await addToCart(productId);
            alert("Товар добавлен в корзину");
        } catch (error) {
            console.error("Ошибка добавления в корзину:", error);
            alert("Не удалось добавить товар в корзину");
        }
    };

    return (
        <div className="products-page">
            <h1>Каталог товаров</h1>

            {error && <p>{error}</p>}

            <div className="products-grid">
                {products.map((product) => (
                    <div
                        className="product-card"
                        key={product.id}
                    >
                        <div className="product-image">
                            🍷
                        </div>

                        <h2>{product.title}</h2>

                        <p>{product.description}</p>

                        <h3>{product.price} ₸</h3>

                        <p>
                            В наличии: {product.stock}
                        </p>

                        <button
                            onClick={() =>
                                handleAddToCart(product.id)
                            }
                            disabled={product.stock === 0}
                        >
                            {product.stock === 0
                                ? "Нет в наличии"
                                : "Добавить в корзину"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
