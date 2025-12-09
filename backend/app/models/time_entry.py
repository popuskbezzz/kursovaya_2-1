"""Модель учёта рабочего времени по задаче."""
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, Numeric, Text, func
from sqlalchemy.orm import relationship

from app.db import Base


class TimeEntry(Base):
    __tablename__ = 'time_entries'

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id', ondelete='CASCADE'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    work_date = Column(Date, nullable=False)
    hours = Column(Numeric(5, 2), nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    task = relationship('Task', back_populates='time_entries')
    user = relationship('User', back_populates='time_entries')
