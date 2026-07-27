import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import type { Product } from "../types/types";
import "./ProductsPage.css";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };

        loadProducts();
    }, []);

    return (
    <div className="products-page">
        <h1>Каталог товаров</h1>

        <div className="products-grid">
            {products.map((product) => (
                <div className="product-card" key={product.id}>
                    <div className="product-image">
                        🍷
                    </div>

                    <h2>{product.title}</h2>

                    <p>{product.description}</p>

                    <h3>{product.price} ₸</h3>

                    <button>Добавить в корзину</button>
                </div>
            ))}
        </div>
    </div>
);
}
