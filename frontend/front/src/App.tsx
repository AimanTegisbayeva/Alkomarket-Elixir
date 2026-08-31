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
                        path="/cart"
                        element={<CartPage />}
                    />
                    
                    <Route
                        path="/profile"
                        element={<ProfilePage />}
                    />

                </Routes>
            </main>

        </BrowserRouter>
    );
}