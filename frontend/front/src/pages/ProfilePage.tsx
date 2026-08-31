import { useEffect, useState } from "react";
import { api } from "../api";

type User = {
    username: string;
    email: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response = await api.get<User>("/auth/me/");
                setUser(response.data);
            } catch {
                setError("Не удалось загрузить профиль.");
            }
        };

        loadUser();
    }, []);

    if (error) {
        return (
            <main>
                <h1>Мой профиль</h1>
                <p>{error}</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main>
                <h1>Мой профиль</h1>
                <p>Загрузка...</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Мой профиль</h1>

            <p>
                <strong>Имя пользователя:</strong>{" "}
                {user.username}
            </p>

            <p>
                <strong>Email:</strong>{" "}
                {user.email}
            </p>
        </main>
    );
}