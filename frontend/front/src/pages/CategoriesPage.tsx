import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getCategories,
    type Category,
} from "../services/categories";
import "./CategoriesPage.css";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error(
                    "Ошибка загрузки категорий:",
                    error
                );

                setError(
                    "Не удалось загрузить категории."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    if (loading) {
        return (
            <main>
                <h1>Категории</h1>
                <p>Загрузка...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <h1>Категории</h1>
                <p>{error}</p>
            </main>
        );
    }

   return (
    <main className="categories-page">
        <h1>Категории алкоголя</h1>

        <div className="categories-grid">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="category-card"
                >
                    <div className="category-icon">
                        {category.name === "Виски" && "🥃"}
                        {category.name === "Вино" && "🍷"}
                        {category.name === "Пиво" && "🍺"}
                        {category.name === "Ром" && "🥃"}
                        {category.name === "Текила" && "🌵"}
                    </div>

                    <h2>{category.name}</h2>

                    <span className="category-link">
                        Смотреть товары →
                    </span>
                </Link>
            ))}
        </div>
    </main>
);
}