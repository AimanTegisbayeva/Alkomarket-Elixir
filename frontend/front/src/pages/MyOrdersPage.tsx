import { useEffect, useState } from "react";
import { getOrders } from "../services/orders";
import type { Order } from "../services/orders";
import "./MyOrdersPage.css";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error(
                    "Ошибка загрузки заказов:",
                    error
                );

                setError("Не удалось загрузить заказы.");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const getStatusText = (status: string) => {
        switch (status) {
            case "new":
                return "Новый";

            case "processing":
                return "В обработке";

            case "delivery":
                return "Доставляется";

            case "completed":
                return "Завершён";

            case "cancelled":
                return "Отменён";

            default:
                return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case "new":
                return "status-new";

            case "processing":
                return "status-processing";

            case "delivery":
                return "status-delivery";

            case "completed":
                return "status-completed";

            case "cancelled":
                return "status-cancelled";

            default:
                return "";
        }
    };

    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-header">
                    <h1>📦 Мои заказы</h1>
                    <p>Загружаем ваши заказы...</p>
                </div>

                <div className="orders-loading">
                    Загрузка...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="orders-page">
                <div className="orders-header">
                    <h1>📦 Мои заказы</h1>
                </div>

                <div className="orders-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-page">
            <div className="orders-header">
                <h1>📦 Мои заказы</h1>

                <p>
                    Здесь вы можете посмотреть историю
                    своих заказов
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <div className="orders-empty-icon">
                        📦
                    </div>

                    <h2>У вас пока нет заказов</h2>

                    <p>
                        После оформления заказа он
                        появится здесь.
                    </p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article
                            className="order-card"
                            key={order.id}
                        >
                            <div className="order-card-header">
                                <div>
                                    <h2>
                                        Заказ №{order.id}
                                    </h2>

                                    <p className="order-date">
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString(
                                            "ru-RU"
                                        )}
                                    </p>
                                </div>

                                <span
                                    className={`order-status ${getStatusClass(
                                        order.status
                                    )}`}
                                >
                                    {getStatusText(
                                        order.status
                                    )}
                                </span>
                            </div>

                            <div className="order-info">
                                <div className="order-info-item">
                                    <span className="info-icon">
                                        📍
                                    </span>

                                    <div>
                                        <span className="info-label">
                                            Адрес доставки
                                        </span>

                                        <strong>
                                            {order.address}
                                        </strong>
                                    </div>
                                </div>

                                <div className="order-info-item">
                                    <span className="info-icon">
                                        📞
                                    </span>

                                    <div>
                                        <span className="info-label">
                                            Телефон
                                        </span>

                                        <strong>
                                            {order.phone}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div className="order-products">
                                <h3>
                                    Товары в заказе
                                </h3>

                                <div className="order-items">
                                    {order.items.map(
                                        (item) => (
                                            <div
                                                className="order-item"
                                                key={item.id}
                                            >
                                                <div className="order-item-icon">
                                                    🍷
                                                </div>

                                                <div className="order-item-info">
                                                    <strong>
                                                        {
                                                            item.product_title
                                                        }
                                                    </strong>

                                                    <span>
                                                        {item.quantity}{" "}
                                                        ×{" "}
                                                        {
                                                            item.price
                                                        }{" "}
                                                        ₸
                                                    </span>
                                                </div>

                                                <strong className="order-item-total">
                                                    {(
                                                        Number(
                                                            item.price
                                                        ) *
                                                        item.quantity
                                                    ).toFixed(
                                                        2
                                                    )}{" "}
                                                    ₸
                                                </strong>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="order-card-footer">
                                <span>
                                    Итого:
                                </span>

                                <strong>
                                    {order.total} ₸
                                </strong>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}