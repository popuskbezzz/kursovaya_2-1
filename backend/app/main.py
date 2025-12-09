"""Точка входа FastAPI-приложения."""
from fastapi import FastAPI

from app.api.routes import api_router
from app.config import settings

# Инициализация приложения. Название берём из конфигурации, чтобы отображалось в документации.
app = FastAPI(title=settings.app_name)

# Подключаем основной роутер. По префиксу можно повесить версионирование /api.
app.include_router(api_router, prefix='/api')


@app.get('/')
async def root() -> dict:
    """Приветственный эндпоинт для быстрой проверки."""
    return {'message': 'Worktime Platform API', 'docs': '/docs', 'health': '/api/health'}
