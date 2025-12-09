"""CRUD-операции для записей времени."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.time_entry import TimeEntry
from app.schemas.time_entry import TimeEntryCreate


async def create_time_entry(session: AsyncSession, entry_in: TimeEntryCreate) -> TimeEntry:
    """Фиксирует отработанное время по задаче."""
    entry = TimeEntry(**entry_in.model_dump())
    session.add(entry)
    await session.flush()
    await session.refresh(entry)
    return entry


async def list_time_entries_by_task(session: AsyncSession, task_id: int) -> list[TimeEntry]:
    """Возвращает все записи времени по конкретной задаче."""
    result = await session.execute(select(TimeEntry).where(TimeEntry.task_id == task_id).order_by(TimeEntry.work_date))
    return list(result.scalars().all())
