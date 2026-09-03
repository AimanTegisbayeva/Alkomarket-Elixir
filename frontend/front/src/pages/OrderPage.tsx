import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orders";
import "./OrderPage.css";
import backgroundImage from "../images/alcohol-background.jpg";

export default function OrderPage() {
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!address.trim() || !phone.trim()) {
            setError("Пожалуйста, заполните все поля.");
            return;
        }

        setLoading(true);

        try {
            await createOrder({
                address: address.trim(),
                phone: phone.trim(),
            });

            navigate("/order-success");
        } catch (error) {
            console.error(
                "Ошибка оформления заказа:",
                error
            );

            setError("Не удалось оформить заказ. Попробуйте ещё раз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="order-page"
            style={{
                backgroundImage: `
            linear-gradient(
                rgba(0, 0, 0, 0.55),
                rgba(0, 0, 0, 0.55)
            ),
            url(${backgroundImage})
        `,
            }}
        >
            <div className="order-container">

                <div className="order-header">
                    <div className="order-icon">
                        🛍️
                    </div>

                    <div>
                        <h1>Оформление заказа</h1>
                        <p>
                            Заполните данные для доставки
                        </p>
                    </div>
                </div>

                <div className="order-content">

                    <div className="order-card">

                        <h2>📦 Данные доставки</h2>

                        <p className="order-description">
                            Укажите адрес и номер телефона,
                            чтобы мы могли доставить ваш заказ.
                        </p>

                        {error && (
                            <div className="order-error">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="address">
                                    📍 Адрес доставки
                                </label>

                                <input
                                    id="address"
                                    type="text"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(event.target.value)
                                    }
                                    placeholder="Например: ул. Абая, 17"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    📞 Телефон
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(event.target.value)
                                    }
                                    placeholder="+7 700 000 00 00"
                                    required
                                />
                            </div>

                            <div className="order-note">
                                <span>ℹ️</span>

                                <p>
                                    После подтверждения заказа
                                    он появится в разделе
                                    «Мои заказы».
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="order-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "⏳ Оформляем заказ..."
                                    : "✓ Подтвердить заказ"}
                            </button>

                        </form>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() => navigate("/cart")}
                        >
                            ← Вернуться в корзину
                        </button>

                    </div>

                </div>

            </div>
        </main>
    );
}