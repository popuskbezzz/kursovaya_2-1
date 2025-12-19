"""Маршруты API: проекты, задачи, учёт времени и демо-данные."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import projects, tasks, time_entries, users
from app.db import get_session
from app.schemas.project import ProjectCreate, ProjectRead
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.schemas.time_entry import TimeEntryCreate, TimeEntryRead
from app.schemas.user import UserCreate, UserRead

api_router = APIRouter()


@api_router.get('/health')
async def healthcheck(session: AsyncSession = Depends(get_session)) -> dict:
    """Health-check с проверкой доступности БД."""
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        raise HTTPException(status_code=503, detail="database unavailable")
    return {"status": "ok"}


@api_router.post('/projects', response_model=ProjectRead)
async def create_project(project_in: ProjectCreate, session: AsyncSession = Depends(get_session)):
    return await projects.create_project(session, project_in)


@api_router.get('/projects', response_model=list[ProjectRead])
async def list_all_projects(session: AsyncSession = Depends(get_session)):
    return await projects.list_projects(session)


@api_router.post('/tasks', response_model=TaskRead)
async def create_task(task_in: TaskCreate, session: AsyncSession = Depends(get_session)):
    return await tasks.create_task(session, task_in)


@api_router.get('/tasks', response_model=list[TaskRead])
async def list_all_tasks(session: AsyncSession = Depends(get_session)):
    return await tasks.list_tasks(session)


@api_router.patch('/tasks/{task_id}', response_model=TaskRead)
async def update_task(task_id: int, task_in: TaskUpdate, session: AsyncSession = Depends(get_session)):
    task = await tasks.update_task(session, task_id, task_in)
    if not task:
        raise HTTPException(status_code=404, detail='Task not found')
    return task


@api_router.post('/time-entries', response_model=TimeEntryRead)
async def create_time_entry(entry_in: TimeEntryCreate, session: AsyncSession = Depends(get_session)):
    return await time_entries.create_time_entry(session, entry_in)


@api_router.get('/tasks/{task_id}/time-entries', response_model=list[TimeEntryRead])
async def list_time_entries(task_id: int, session: AsyncSession = Depends(get_session)):
    return await time_entries.list_time_entries_by_task(session, task_id)


@api_router.post('/demo/seed', response_model=dict)
async def seed_demo_data(session: AsyncSession = Depends(get_session)):
    """
    Простая загрузка демо-данных для ручного теста.
    Создаёт пользователя, проект, задачу и запись времени, если их ещё нет.
    """
    user_email = 'demo.user@example.com'
    user = await users.get_user_by_email(session, user_email)
    if not user:
        user = await users.create_user(
            session,
            UserCreate(email=user_email, full_name='Demo User', role='employee'),
        )

    project_list = await projects.list_projects(session)
    project = project_list[0] if project_list else await projects.create_project(
        session, ProjectCreate(name='Demo Project', description='Демо-проект для проверки API')
    )

    task_list = await tasks.list_tasks(session)
    task = task_list[0] if task_list else await tasks.create_task(
        session,
        TaskCreate(
            title='Demo Task',
            description='Пример задачи для демонстрации',
            status='open',
            project_id=project.id,
            assignee_id=user.id,
        ),
    )

    await time_entries.create_time_entry(
        session,
        TimeEntryCreate(task_id=task.id, user_id=user.id, work_date='2024-01-01', hours=2, comment='Первый лог времени'),
    )

    return {'message': 'demo data created', 'user_id': user.id, 'project_id': project.id, 'task_id': task.id}
