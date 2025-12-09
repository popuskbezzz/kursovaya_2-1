# Многостадийный Dockerfile для backend (FastAPI + Uvicorn)
# Stage 1: установка зависимостей в изолированную директорию пользователя
FROM --platform=linux/amd64 python:3.12-slim-bullseye AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Устанавливаем системные зависимости для сборки пакетов (asyncpg требует libpq)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN python -m pip install --user -r requirements.txt

# Stage 2: финальный лёгкий образ
FROM --platform=linux/amd64 python:3.12-slim-bullseye AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PATH="/root/.local/bin:$PATH"

# Минимальные зависимости для работы с PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем установленный слой пакетов из builder
COPY --from=builder /root/.local /root/.local

# Копируем исходники приложения и миграции
COPY app app
COPY alembic alembic
COPY alembic.ini ./

EXPOSE 8000

# Для параметров подключения к БД используйте переменные окружения (APP_DATABASE_URL и т.д.)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
