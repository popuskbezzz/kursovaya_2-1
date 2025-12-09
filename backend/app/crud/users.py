"""Простые операции с пользователями (для демо)."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.user import UserCreate


async def create_user(session: AsyncSession, user_in: UserCreate) -> User:
    """Создаёт пользователя (минимально для демо-данных)."""
    user = User(**user_in.model_dump())
    session.add(user)
    await session.flush()
    await session.refresh(user)
    return user


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    """Возвращает пользователя по email, если он есть."""
    result = await session.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
