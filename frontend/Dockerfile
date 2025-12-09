# Многостадийный Dockerfile для фронтенда (React + Vite).
# Оптимизирован под повторные сборки: сначала копируем package*.json, затем устанавливаем зависимости, потом копируем исходники.
# Используем npm ci при наличии package-lock.json; если его нет — fallback на npm install.

FROM node:20-alpine AS builder
WORKDIR /app

# Отключаем лишние подсказки npm
RUN npm config set fund false && npm config set update-notifier false

# 1) Ставим зависимости (кэшируется по package*.json)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-fund --no-audit; fi && npm cache clean --force

# 2) Копируем остальной исходный код (с учётом .dockerignore)
COPY . .

# 3) Собираем production-бандл
RUN npm run build

# Runtime-образ: только nginx + статические файлы
FROM nginx:1.25-alpine AS runtime
WORKDIR /usr/share/nginx/html

# SPA fallback — отдаём index.html для неизвестных путей
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
