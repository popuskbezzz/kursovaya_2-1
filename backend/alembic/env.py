"""Alembic config: подключение к БД и метаданные моделей."""
from __future__ import annotations

import asyncio
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Добавляем корень backend в sys.path, чтобы alembic видел app.*
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

from app.config import settings
from app.db import Base
import app.models  # noqa: F401  # Импортируем модели, чтобы metadata содержала все таблицы

config = context.config

# Если URL не задан в alembic.ini, берём из настроек приложения.
if not config.get_main_option('sqlalchemy.url'):
    config.set_main_option('sqlalchemy.url', settings.database_url)

if config.config_file_name:
    fileConfig(config.config_file_name)

# Метаданные используются для автогенерации миграций.
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Запуск миграций в offline-режиме (генерация SQL)."""
    url = config.get_main_option('sqlalchemy.url')
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={'paramstyle': 'named'},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    """Основной запуск миграций в online-режиме."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Создаёт async-engine и выполняет миграции."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
        future=True,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations() -> None:
    """Выбор режима запуска миграций в зависимости от настроек Alembic."""
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        asyncio.run(run_migrations_online())


run_migrations()
