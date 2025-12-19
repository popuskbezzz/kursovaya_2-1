from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes import api_router
from app.config import settings
from app.db import Base, engine

logger = logging.getLogger(__name__)

logging.basicConfig(level=logging.INFO)

app = FastAPI(title=settings.app_name)
app.include_router(api_router, prefix="/api")


@app.on_event("startup")
async def startup() -> None:
    """Опциональное автосоздание схемы для чисто демо-окружения."""
    if not settings.auto_create_schema:
        return

    import app.models  # noqa: F401 (регистрация моделей в Base.metadata)

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    logger.info("Database schema ensured (create_all)")


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    logger.exception("Database error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Database error"})


@app.get("/")
async def root() -> dict:
    return {"message": "Worktime Platform API", "docs": "/docs", "health": "/api/health"}
