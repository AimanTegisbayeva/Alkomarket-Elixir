import { useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
    const navigate = useNavigate();

    return (
        <main>
            <h1>Заказ успешно оформлен! 🎉</h1>

            <p>Спасибо за ваш заказ.</p>

            <button
                onClick={() => navigate("/products")}
            >
                Вернуться в каталог
            </button>
        </main>
    );
}