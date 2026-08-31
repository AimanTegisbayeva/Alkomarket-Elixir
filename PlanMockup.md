# 🍷 Alkomarket — детальный план разработки (MVP)

## 1. Что уже сделано

- [x] Django backend + DRF
- [x] React + Vite frontend
- [x] Модель `Category`
- [x] Модель `Product`
- [x] API `GET /api/categories/`
- [x] API `GET /api/products/`
- [x] API `GET /api/products/:id/`
- [x] Страница каталога товаров
- [x] Регистрация API `POST /api/auth/register/`
- [x] Страница регистрации
- [x] Логин API `POST /api/auth/login/`
- [x] Страница входа
- [x] JWT токены сохраняются в `localStorage`
- [x] Базовый API client и роутинг
- [ ] Корзина
- [ ] Заказы
- [ ] Поиск и фильтрация
- [ ] Валидация и тесты
- [ ] Админ/права доступа
- [ ] Финальная проверка и деплой

---

## 2. Детальный план по этапам

### Эпик 1. Подготовка проекта

- [x] 1.1. Проверить запуск Docker Compose
  - запустить `docker compose up`
  - проверить контейнеры: `db`, `backend`, `frontend`
- [x] 1.2. Проверить, что backend и frontend работают
  - backend доступен по `http://localhost:8000`
  - frontend доступен по `http://localhost:5173`
- [x] 1.3. Проверить подключение Django к PostgreSQL
  - убедиться, что миграции применяются
  - проверить, что приложение видит базу
- [x] 1.4. Проверить базовый API
  - `GET /api/books/`
  - после этого заменить `Book` на реальный каталог

### Эпик 2. Каталог товаров

#### Модели

- [ ] 2.1. Создать модель `Category`
  - поля: `id`, `name`
  - пример: `Вино`, `Водка`, `Виски`
- [x] 2.2. Создать модель `Product`
  - поля: `id`, `category`, `title`, `description`, `price`, `image`, `stock`
  - связь: `Product -> Category`

#### API

- [ ] 2.3. Реализовать список категорий
  - `GET /api/categories/`
  - возвращает: `[{"id": 1, "name": "Вино"}]`
- [ ] 2.4. Реализовать список товаров
  - `GET /api/products/`
  - возвращает все товары
- [ ] 2.5. Реализовать карточку товара
  - `GET /api/products/<id>/`
  - возвращает один товар по id
- [ ] 2.6. Добавить поиск и фильтрацию
  - `GET /api/products/?category=1`
  - `GET /api/products/?search=вино`
  - `GET /api/products/?ordering=price`

#### Проверка

- [ ] 2.7. Проверить API через браузер / Postman
- [ ] 2.8. Убедиться, что React получает реальные данные из Django

### Эпик 3. Авторизация

#### Модели

- [ ] 3.1. Использовать стандартную `User` модель Django
- [ ] 3.2. Убедиться, что пароль хешируется безопасно

#### API

- [ ] 3.3. Регистрация
  - `POST /api/auth/register/`
  - body: `{ "username": "aiman", "email": "aiman@example.com", "password": "StrongPassword123" }`
  - response: user + access token + refresh token
- [ ] 3.4. Вход
  - `POST /api/auth/login/`
  - body: `{ "username": "aiman", "password": "StrongPassword123" }`
  - response: `{ "access": "...", "refresh": "..." }`
- [ ] 3.5. Обновление JWT
  - `POST /api/auth/refresh/`
  - body: `{ "refresh": "..." }`
  - response: новый `access` token
- [ ] 3.6. Получить текущего пользователя
  - `GET /api/auth/me/`
  - требует `Authorization: Bearer <token>`
  - response: `{ "id": 1, "username": "aiman", "email": "aiman@example.com" }`

#### Frontend

- [ ] 3.7. Сохранять токены в `localStorage`
- [ ] 3.8. Подключить авторизацию к запросам через axios interceptors
- [ ] 3.9. Ограничить доступ к приватным страницам

### Эпик 4. Корзина

#### Зачем нужна корзина

Корзина — это временный список товаров, который пользователь собирает перед оформлением заказа. Она должна быть привязана к конкретному пользователю.

#### Модели

- [ ] 4.1. Создать модель `Cart`
  - поля: `id`, `user`, `created_at`
  - один пользователь = одна активная корзина
- [ ] 4.2. Создать модель `CartItem`
  - поля: `id`, `cart`, `product`, `quantity`
  - связь: `Cart -> CartItem -> Product`

#### API

- [ ] 4.3. Получить корзину пользователя
  - `GET /api/cart/`
  - требует авторизацию
  - response example:

```json
{
  "id": 1,
  "items": [
    {
      "id": 10,
      "product": {
        "id": 1,
        "title": "Вино",
        "price": "4500.00",
        "image": "/media/products/wine.jpg"
      },
      "quantity": 2,
      "subtotal": "9000.00"
    }
  ],
  "total": "9000.00"
}
```

- [ ] 4.4. Добавить товар в корзину
  - `POST /api/cart/items/`
  - body: `{ "product_id": 1, "quantity": 2 }`
  - response: `{ "message": "Product added to cart" }`
- [ ] 4.5. Изменить количество товара
  - `PATCH /api/cart/items/<id>/`
  - body: `{ "quantity": 3 }`
  - обновляет только количество конкретного товара в корзине
- [ ] 4.6. Удалить товар из корзины
  - `DELETE /api/cart/items/<id>/`
  - response: `204 No Content`

#### Валидация

- [ ] 4.7. Проверить, что товар существует
- [ ] 4.8. Проверить, что `quantity > 0`
- [ ] 4.9. Проверить, что пользователь не видит чужую корзину
- [ ] 4.10. Проверить, что нельзя купить больше товара, чем есть на складе

#### Правила

- [ ] 4.11. Корзина должна быть только у авторизованного пользователя
- [ ] 4.12. Сумма корзины считается на backend
- [ ] 4.13. Цена товара в корзине не должна передаваться с frontend без проверки

### Эпик 5. Заказы

#### Зачем нужен заказ

Заказ — это итог корзины после оформления. После создания заказа данные корзины должны быть зафиксированы и больше не изменяться.

#### Модели

- [ ] 5.1. Создать модель `Order`
  - поля: `id`, `user`, `status`, `delivery_address`, `phone`, `total`, `created_at`
  - статусы: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`
- [ ] 5.2. Создать модель `OrderItem`
  - поля: `id`, `order`, `product`, `quantity`, `price`
  - важно: сохранять `price` на момент заказа, чтобы не менять старые заказы

#### API

- [ ] 5.3. Создать заказ
  - `POST /api/orders/`
  - body: `{ "delivery_address": "г. Атырау, ул. Абая, 10", "phone": "+77000000000" }`
  - backend должен взять товары из корзины пользователя
  - response: созданный заказ + total + status
- [ ] 5.4. Получить список своих заказов
  - `GET /api/orders/`
  - возвращает только заказы текущего пользователя
- [ ] 5.5. Получить один заказ
  - `GET /api/orders/<id>/`
  - возвращает состав заказа и детали

#### Валидация

- [ ] 5.6. Проверить, что корзина не пустая
- [ ] 5.7. Проверить, что адрес заполнен
- [ ] 5.8. Проверить, что телефон заполнен
- [ ] 5.9. Проверить, что пользователь видит только свои заказы
- [ ] 5.10. После оформления заказа корзина очищается

### Эпик 6. Frontend

- [ ] 6.1. Страница каталога товаров
  - `ProductsPage`
  - отображает список товаров из `GET /api/products/`
- [ ] 6.2. Страница товара
  - `ProductDetailPage`
  - показывается один товар по `GET /api/products/:id/`
- [ ] 6.3. Страница регистрации
  - `RegisterPage`
  - `POST /api/auth/register/`
- [ ] 6.4. Страница входа
  - `LoginPage`
  - `POST /api/auth/login/`
- [ ] 6.5. Корзина
  - `CartPage`
  - `GET /api/cart/`
  - кнопки: +, -, удалить
- [ ] 6.6. Оформление заказа
  - `CheckoutPage`
  - ввод адреса и телефона
  - `POST /api/orders/`
- [ ] 6.7. Список заказов
  - `OrdersPage`
  - `GET /api/orders/`
- [ ] 6.8. Обработка ошибок и загрузки
  - loading spinner
  - error toast / message
- [ ] 6.9. Защитить приватные маршруты
  - корзина
  - оформление заказа
  - личные заказы

### Эпик 7. Проверка и стабильность

- [ ] 7.1. Добавить базовую валидацию
  - email
  - пароль
  - количество товара
  - обязательные поля в заказе
- [ ] 7.2. Проверить права доступа
  - обычный пользователь не видит чужие заказы
  - обычный пользователь не может редактировать товары
- [ ] 7.3. Написать тесты для API
  - `auth`
  - `products`
  - `cart`
  - `orders`
- [ ] 7.4. Проверить edge cases
  - пустая корзина
  - товар не найден
  - неверный токен
  - слишком большое количество
- [ ] 7.5. Проверить основной сценарий пользователя
  - регистрация → вход → каталог → товар → корзина → заказ

### Эпик 8. Финальный релиз

- [ ] 8.1. Проверить Docker Compose
- [ ] 8.2. Проверить, что все миграции применяются
- [ ] 8.3. Подготовить проект к демонстрации
- [ ] 8.4. Зафиксировать MVP

---

## 3. Краткий список API для MVP

### Auth

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Catalog

- `GET /api/categories/`
- `GET /api/products/`
- `GET /api/products/<id>/`

### Cart

- `GET /api/cart/`
- `POST /api/cart/items/`
- `PATCH /api/cart/items/<id>/`
- `DELETE /api/cart/items/<id>/`

### Orders

- `POST /api/orders/`
- `GET /api/orders/`
- `GET /api/orders/<id>/`

---

## 4. Приоритет старта

Сначала делаем только:

1. `Category`
2. `Product`
3. `GET /api/categories/`
4. `GET /api/products/`
5. React-каталог

Потом:

6. `Register`
7. `Login`
8. `JWT`
9. `Cart`
10. `Orders`

Это минимальный рабочий MVP.
