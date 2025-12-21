# Worktime Platform

Платформа для учёта задач и рабочего времени сотрудников. Демонстрационный проект с фронтендом (React/TS), API (FastAPI), БД (PostgreSQL), прокси (Traefik) и администрированием БД (pgAdmin). Предусмотрены сценарии локального запуска через Docker Compose и учебного деплоя через Docker Swarm (overlay-сети, репликация сервисов), а также CI/CD без SSH.

## Стек
- Backend: Python 3.11, FastAPI, SQLAlchemy, Alembic.
- Frontend: React, TypeScript, Vite.
- База данных: PostgreSQL, pgAdmin для администрирования.
- Сетевые компоненты: Traefik (reverse-proxy, маршрутизация).
- Контейнеризация: Docker Compose (локально), Docker Swarm (stack, overlay-сети).
- CI/CD: GitLab CI (build -> deploy без SSH).

## Основные сущности и логика
- Пользователь: роли admin/manager/employee, JWT-аутентификация, профиль.
- Проект: владелец/менеджер, статус.
- Задача: принадлежит проекту, исполнитель, статусы open/in_progress/done.
- Запись времени (worklog): ссылка на задачу, пользователь, дата/интервал, длительность, комментарий.
- Отчёты: агрегаты по пользователю/проекту/периоду (суммарные часы).
- Минимально реализуемый функционал для демо:
  - CRUD проектов и задач.
  - Фиксация рабочего времени по задаче.
  - Простые отчёты: суммарно по пользователю за период, по проекту, по задаче.
  - Базовая аутентификация с ролями без сложного IAM.

## Архитектура (обзор)
- Traefik как точка входа: роутит web и api по host/path, общая сеть.
- Backend (api): FastAPI, PostgreSQL, миграции Alembic, JWT, эндпоинты задач/таймшитов/отчётов.
- Frontend (web): React/TS SPA, страницы проектов, задач, лога времени, отчётов.
- DB: PostgreSQL; pgAdmin доступен через Traefik с базовой аутентификацией.
- Локальный запуск: `docker compose -f infra/docker-compose.yml up -d`.
- Swarm: `infra/stack-worktime.yml`, overlay-сети, Traefik как ingress.
- CI/CD: GitLab CI (build -> deploy без SSH) на той же машине, где runner.

## Структура репозитория
- backend/ — FastAPI-приложение, модели, роуты, миграции.
- frontend/ — SPA на React/TS.
- infra/ — docker-compose, swarm stack, Traefik конфиги.
- docs/ — материалы для отчёта, схемы.

## Быстрый старт (локально, compose)
1) Скопировать env:
   - `cp infra/.env.example infra/.env`
2) Запуск:
   - `docker compose -f infra/docker-compose.yml up -d`
3) Проверка:
   - Web: http://localhost/
   - API health: http://localhost/api/health
   - Traefik dashboard: http://localhost:8080/dashboard/
   - pgAdmin: http://localhost/pgadmin
4) Миграции:
   - `docker compose -f infra/docker-compose.yml exec api alembic upgrade head`

## Swarm (локальный учебный деплой)
1) Инициализация (если Swarm ещё не активен):
   - `docker swarm init`
2) Деплой:
   - `docker stack deploy -c infra/stack-worktime.yml worktime`
3) Проверка:
   - `docker stack ls`
   - `docker service ls`
   - `docker ps`

## CI/CD без SSH (локальный Swarm)
Требования:
- Установлен Docker и Docker Compose.
- Установлен GitLab Runner на той же машине, где нужен деплой.
- Runner настроен на доступ к Docker daemon хоста (docker executor + /var/run/docker.sock).

Проверка/запуск runner (пример для service):
- `gitlab-runner status`
- `gitlab-runner run` (если нужен запуск вручную)

Как работает:
- Push в `main` -> pipeline -> build (worktime-api, worktime-web) -> deploy в локальный Swarm.
- Никаких SSH/scp: деплой выполняется напрямую через Docker API на машине runner.

Ограничения:
- Деплой работает только на машине, где запущен runner и есть доступ к Docker.
- Если runner не имеет доступа к docker.sock, pipeline не сможет собрать/развернуть образы.
