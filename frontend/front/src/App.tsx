import { useState } from "react";
import {
    BrowserRouter,
    Navigate,
    NavLink,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import OrderPage from "./pages/OrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";


import { isAuthenticated, clearTokens } from "./api";

import "./App.css";

function Header({
    authenticated,
    setAuthenticated,
}: {
    authenticated: boolean;
    setAuthenticated: (value: boolean) => void;
}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearTokens();
        setAuthenticated(false);
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-container">

                <NavLink to="/products" className="logo">
                    Alkomarket
                </NavLink>

                <nav className="nav">

                    <NavLink to="/products">
                        Каталог
                    </NavLink>

                    <NavLink to="/categories">
                        Категории
                    </NavLink>

                    {!authenticated && (
                        <>
                            <NavLink to="/register">
                                Регистрация
                            </NavLink>

                            <NavLink to="/login">
                                Войти
                            </NavLink>
                        </>
                    )}

                    {authenticated && (
                        <>
                            <NavLink to="/profile">
                                👤 Профиль
                            </NavLink>

                            <NavLink to="/orders">
                                📦 Мои заказы
                            </NavLink>

                            <button onClick={handleLogout}>
                                Выйти
                            </button>
                        </>
                    )}

                    <NavLink to="/cart">
                        🛒 Корзина
                    </NavLink>

                </nav>

            </div>
        </header>
    );
}

export default function App() {
    const [authenticated, setAuthenticated] = useState(
        isAuthenticated()
    );

    return (
        <BrowserRouter>

            <Header
                authenticated={authenticated}
                setAuthenticated={setAuthenticated}
            />

            <main>
                <Routes>

                    <Route
                        path="/"
                        element={<Navigate to="/products" replace />}
                    />

                    <Route
                        path="/products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />

                    <Route
                        path="/login"
                        element={
                            <LoginPage
                                onLogin={() => setAuthenticated(true)}
                            />
                        }
                    />

                    <Route
                        path="/order"
                        element={<OrderPage />}
                    />
                    <Route
                        path="/order-success"
                        element={<OrderSuccessPage />}
                    />

                    <Route
                        path="/cart"
                        element={<CartPage />}
                    />

                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />
                    <Route
                        path="/orders"
                        element={<MyOrdersPage />} />

                    <Route
                        path="/categories"
                        element={<CategoriesPage />}
                    />

                    <Route
                        path="/category/:id"
                        element={<CategoryProductsPage />}
                    />

                </Routes>
            </main>

        </BrowserRouter>
    );
}