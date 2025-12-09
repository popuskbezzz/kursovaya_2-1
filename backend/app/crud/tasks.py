"""CRUD-операции для задач."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate


async def create_task(session: AsyncSession, task_in: TaskCreate) -> Task:
    """Создаёт задачу в проекте."""
    task = Task(**task_in.model_dump())
    session.add(task)
    await session.flush()
    await session.refresh(task)
    return task


async def list_tasks(session: AsyncSession) -> list[Task]:
    """Возвращает все задачи."""
    result = await session.execute(select(Task).order_by(Task.id))
    return list(result.scalars().all())


async def update_task(session: AsyncSession, task_id: int, task_in: TaskUpdate) -> Task | None:
    """Обновляет задачу по id."""
    task = await session.get(Task, task_id)
    if not task:
        return None

    for key, value in task_in.model_dump(exclude_unset=True).items():
        setattr(task, key, value)

    await session.flush()
    await session.refresh(task)
    return task
