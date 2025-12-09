"""Конфигурация приложения: читаем переменные окружения и готовим настройки."""
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # URL подключения к базе данных PostgreSQL через asyncpg
    database_url: str = 'postgresql+asyncpg://postgres:postgres@db:5432/worktime'
    app_name: str = 'Worktime Platform API'
    environment: str = 'local'
    backend_cors_origins: list[str] | str = []
    server_host: str = '0.0.0.0'
    server_port: int = 8000

    model_config = SettingsConfigDict(
        env_file='.env', env_prefix='APP_', env_file_encoding='utf-8', extra='ignore'
    )

    @property
    def cors_allowed_origins(self) -> List[str]:
        """Возвращает список разрешённых источников для CORS."""
        if isinstance(self.backend_cors_origins, str):
            if not self.backend_cors_origins:
                return []
            return [origin.strip() for origin in self.backend_cors_origins.split(',') if origin.strip()]
        return self.backend_cors_origins


# Один экземпляр настроек на всё приложение.
settings = Settings()
