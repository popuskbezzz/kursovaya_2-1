"""Pydantic-схемы для пользователя."""
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = 'employee'


class UserCreate(UserBase):
    """Схема для создания пользователя (используется в демо-наполнении)."""
    pass


class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True
