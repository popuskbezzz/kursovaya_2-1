# Многостадийный Dockerfile для фронтенда (React + Vite)
FROM node:20-alpine AS builder
WORKDIR /app

# Ускоряем npm: отключаем fund и notifier
RUN npm config set fund false && npm config set update-notifier false

# Ставим зависимости с кэшированием по package*.json
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-fund --no-audit; fi && npm cache clean --force

# Копируем исходники (контекст очищен .dockerignore)
COPY . .

# Собираем production-бандл
RUN npm run build

# Runtime-образ
FROM nginx:1.25-alpine AS runtime
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
