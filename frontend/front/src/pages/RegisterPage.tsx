import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/register/";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      await axios.post(API_URL, {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Ошибка регистрации:", error.response?.data);

        setError(
          JSON.stringify(error.response?.data)
        );
      } else {
        setError("Произошла ошибка.");
      }
    }
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Регистрация</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Повтор пароля"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          Зарегистрироваться
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      <p>
        Уже есть аккаунт?{" "}
        <Link to="/login">Войти</Link>
      </p>
    </main>
  );
}