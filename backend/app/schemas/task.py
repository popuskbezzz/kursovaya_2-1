"""Схемы задач."""
from typing import Optional
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = 'open'
    project_id: int
    assignee_id: Optional[int] = None


class TaskCreate(TaskBase):
    """Схема создания задачи."""
    pass


class TaskUpdate(BaseModel):
    """Частичное обновление задачи."""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[int] = None


class TaskRead(TaskBase):
    id: int

    class Config:
        from_attributes = True
