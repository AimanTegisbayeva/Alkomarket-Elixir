import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrders, payOrder } from "../services/orders";
import type { Order } from "../services/orders";

export default function PaymentPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const orders = await getOrders();

                const foundOrder = orders.results.find(
                    (item) => item.id === Number(id)
                );

                if (!foundOrder) {
                    setError("Заказ не найден.");
                    return;
                }

                setOrder(foundOrder);
            } catch (error) {
                console.error(
                    "Ошибка загрузки заказа:",
                    error
                );
                setError("Не удалось загрузить заказ.");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [id]);

    const handlePayment = async () => {
        if (!order) {
            return;
        }

        setPaying(true);
        setError("");

        try {
            await payOrder(order.id);

            navigate("/order-success");
        } catch (error) {
            console.error(
                "Ошибка оплаты:",
                error
            );

            setError(
                "Не удалось выполнить оплату. Попробуйте ещё раз."
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <main className="payment-page">
                <div className="payment-card">
                    <h1>💳 Оплата заказа</h1>
                    <p>Загружаем информацию о заказе...</p>
                </div>
            </main>
        );
    }

    if (error && !order) {
        return (
            <main className="payment-page">
                <div className="payment-card">
                    <h1>💳 Оплата заказа</h1>

                    <div className="payment-error">
                        ⚠️ {error}
                    </div>

                    <button
                        onClick={() => navigate("/orders")}
                    >
                        Перейти к моим заказам
                    </button>
                </div>
            </main>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <main className="payment-page">
            <div className="payment-card">

                <div className="payment-icon">
                    💳
                </div>

                <h1>Оплата заказа</h1>

                <p className="payment-subtitle">
                    Заказ №{order.id}
                </p>

                <div className="payment-info">
                    <div className="payment-row">
                        <span>Сумма заказа</span>
                        <strong>
                            {order.total} ₸
                        </strong>
                    </div>

                    <div className="payment-row">
                        <span>Способ оплаты</span>
                        <strong>
                            💳 Банковская карта
                        </strong>
                    </div>
                </div>

                <div className="payment-demo">
                    <span>ℹ️</span>

                    <p>
                        Это демонстрационная оплата
                        для дипломного проекта.
                        Реальные банковские данные
                        вводить не требуется.
                    </p>
                </div>

                {error && (
                    <div className="payment-error">
                        ⚠️ {error}
                    </div>
                )}

                <button
                    className="payment-button"
                    onClick={handlePayment}
                    disabled={paying || order.is_paid}
                >
                    {paying
                        ? "⏳ Выполняем оплату..."
                        : order.is_paid
                            ? "✓ Заказ уже оплачен"
                            : `Оплатить ${order.total} ₸`}
                </button>

                <button
                    className="payment-back"
                    onClick={() => navigate("/orders")}
                    disabled={paying}
                >
                    ← Вернуться к моим заказам
                </button>

            </div>
        </main>
    );
}