import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const API_URL = "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_URL,
});

// Добавляем access_token к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Автоматическое обновление access_token
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // Если это не 401 — просто передаём ошибку дальше
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Не пытаемся обновлять токен бесконечно
    if (originalRequest._retry) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refresh_token");

    // Если refresh_token отсутствует
    if (!refreshToken) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    try {
      // Получаем новый access_token
      const response = await axios.post(
        `${API_URL}/auth/refresh/`,
        {
          refresh: refreshToken,
        }
      );

      const newAccessToken = response.data.access;

      // Сохраняем новый access_token
      localStorage.setItem("access_token", newAccessToken);

      // Добавляем новый токен к первоначальному запросу
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Повторяем первоначальный запрос
      return api(originalRequest);
    } catch (refreshError) {
      // Если refresh_token тоже недействителен
      clearTokens();
      window.location.href = "/login";

      return Promise.reject(refreshError);
    }
  }
);

// Сохраняем токены после входа
export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

// Удаляем токены при выходе
export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Проверяем авторизацию
export function isAuthenticated() {
  return Boolean(localStorage.getItem("access_token"));
}
