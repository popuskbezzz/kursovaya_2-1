"""Схемы учёта времени."""
from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field


class TimeEntryBase(BaseModel):
    task_id: int
    user_id: int
    work_date: date
    hours: Decimal = Field(gt=0, description='Отработанное время в часах, больше нуля')
    comment: Optional[str] = None


class TimeEntryCreate(TimeEntryBase):
    """Создание записи времени."""
    pass


class TimeEntryRead(TimeEntryBase):
    id: int

    class Config:
        from_attributes = True
