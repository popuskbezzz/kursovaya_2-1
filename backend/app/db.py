"""Создание подключений к базе и фабрики сессий."""
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base

from app.config import settings

# Базовый класс для всех моделей.
Base = declarative_base()

# Движок БД: управляет пулом подключений.
engine = create_async_engine(settings.database_url, future=True, echo=False)

# Фабрика сессий для работы с БД в async-режиме.
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


@asynccontextmanager
async def get_session() -> AsyncSession:
    """Возвращает сессию как зависимость FastAPI, с управлением commit/rollback."""
    session: AsyncSession = SessionLocal()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
