"""CRUD-операции для проектов."""
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.project import Project
from app.schemas.project import ProjectCreate


async def create_project(session: AsyncSession, project_in: ProjectCreate) -> Project:
    """Создаёт проект и возвращает его."""
    project = Project(**project_in.model_dump())
    session.add(project)
    await session.flush()  # получаем id без отдельного запроса
    await session.refresh(project)
    return project


async def list_projects(session: AsyncSession) -> list[Project]:
    """Возвращает все проекты."""
    result = await session.execute(select(Project).order_by(Project.id))
    return list(result.scalars().all())
