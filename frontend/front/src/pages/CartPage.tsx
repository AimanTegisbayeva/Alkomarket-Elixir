import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    removeFromCart,
    updateQuantity,
} from "../services/cart";
import type { Cart } from "../types/types";

export default function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const increaseQuantity = async (
        itemId: number,
        quantity: number
    ) => {
        try {
            await updateQuantity(itemId, quantity + 1);
            await loadCart();
        } catch (error) {
            console.error(
                "Ошибка изменения количества:",
                error
            );
        }
    };

    const decreaseQuantity = async (
        itemId: number,
        quantity: number
    ) => {
        if (quantity <= 1) {
            return;
        }

        try {
            await updateQuantity(itemId, quantity - 1);
            await loadCart();
        } catch (error) {
            console.error(
                "Ошибка изменения количества:",
                error
            );
        }
    };

    const deleteItem = async (itemId: number) => {
        try {
            await removeFromCart(itemId);
            await loadCart();
        } catch (error) {
            console.error(
                "Ошибка удаления товара:",
                error
            );
        }
    };

    if (loading) {
        return <p>Загрузка корзины...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div>
                <h1>Корзина</h1>
                <p>Корзина пока пустая</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Корзина</h1>

            {cart.items.map((item) => (
                <div key={item.id}>
                    <h2>{item.product_title}</h2>

                    <p>
                        Цена: {item.price} ₸
                    </p>

                    <button
                        onClick={() =>
                            decreaseQuantity(
                                item.id,
                                item.quantity
                            )
                        }
                    >
                        −
                    </button>

                    <span>
                        {" "}
                        {item.quantity}{" "}
                    </span>

                    <button
                        onClick={() =>
                            increaseQuantity(
                                item.id,
                                item.quantity
                            )
                        }
                    >
                        +
                    </button>

                    <p>
                        Сумма: {item.total} ₸
                    </p>

                    <button
                        onClick={() =>
                            deleteItem(item.id)
                        }
                    >
                        Удалить
                    </button>
                </div>
            ))}

            <h2>
                Итого: {cart.total} ₸
            </h2>
            <button
                onClick={() => navigate("/order")}
            >
                Оформить заказ
            </button>
        </div>
    );
}