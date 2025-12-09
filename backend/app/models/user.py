"""Модель пользователя: сотрудник с ролью и контактами."""
from sqlalchemy import Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='employee')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Связи позволяют навигировать к задачам и учёту времени конкретного сотрудника.
    tasks = relationship('Task', back_populates='assignee')
    time_entries = relationship('TimeEntry', back_populates='user')
