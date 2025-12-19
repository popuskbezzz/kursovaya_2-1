"""Конфигурация приложения: читаем переменные окружения и готовим настройки."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # URL подключения к базе данных PostgreSQL через asyncpg
    database_url: str = 'postgresql+asyncpg://postgres:postgres@db:5432/worktime'
    app_name: str = 'Worktime Platform API'
    environment: str = 'local'
    auto_create_schema: bool = False  # В продакшене полагаемся на Alembic, включать вручную только в демо

    model_config = SettingsConfigDict(env_file='.env', env_prefix='APP_', env_file_encoding='utf-8')


# Один экземпляр настроек на всё приложение.
settings = Settings()
