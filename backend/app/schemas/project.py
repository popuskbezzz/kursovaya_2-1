"""Схемы проектов."""
from typing import Optional
from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Схема создания проекта."""
    pass


class ProjectRead(ProjectBase):
    id: int

    class Config:
        from_attributes = True
