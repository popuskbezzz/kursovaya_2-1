"""Точка входа FastAPI-приложения."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.config import settings

# Инициализация приложения. Название берём из конфигурации, чтобы отображалось в документации.
app = FastAPI(title=settings.app_name)

# CORS: разрешаем запросы с указанных фронтенд-хостов (используется Traefik + SPA)
if settings.cors_allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Подключаем основной роутер. По префиксу можно повесить версионирование /api.
app.include_router(api_router, prefix='/api')


@app.get('/')
async def root() -> dict:
    """Приветственный эндпоинт для быстрой проверки."""
    return {'message': 'Worktime Platform API', 'docs': '/docs', 'health': '/api/health'}
