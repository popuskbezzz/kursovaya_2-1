# Worktime Platform

Платформа для учёта задач и рабочего времени сотрудников. Демонстрационный проект с фронтендом (React/TS), API (FastAPI), БД (PostgreSQL), прокси (Traefik) и администрированием БД (pgAdmin). Предусмотрены сценарии локального запуска через Docker Compose и кластерного деплоя через Docker Swarm (overlay-сети, репликация сервисов), а также основа под CI/CD (GitLab CI для сборки образов и выката stack).

## Стек
- Backend: Python 3.11, FastAPI, SQLAlchemy, Alembic.
- Frontend: React, TypeScript, Vite, UI-библиотека (например, MUI/Antd — уточнить при разработке).
- База данных: PostgreSQL, pgAdmin для администрирования.
- Сетевые компоненты: Traefik (reverse-proxy, маршрутизация, TLS при необходимости).
- Контейнеризация: Docker Compose (локально), Docker Swarm (stack, overlay-сети, реплики).
- CI/CD: заготовка под GitLab CI (build → push образов → deploy stack).

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
- Локальный запуск: docker compose -f infra/compose/docker-compose.yml up -d.
- Swarm: stack-файл(ы) в infra/swarm, overlay-сети, реплики для api и web, Traefik как ingress.
- CI/CD: шаблон GitLab CI (build → push образов → deploy stack).

## Структура репозитория
- ackend/ — FastAPI-приложение, модели, роуты, миграции.
- rontend/ — SPA на React/TS.
- infra/compose/ — docker-compose для локального запуска.
- infra/swarm/ — stack-файлы, overlay-сети, labels для Traefik, реплики.
- infra/traefik/ — динамическая конфигурация, middleware.
- scripts/ — утилиты сборки/деплоя, CI-шаблоны.
- docs/ — материалы для отчёта, схемы.

## Быстрый старт (локально, compose)
1. Скопировать .env.example в .env, задать пароли/хосты.
2. docker compose -f infra/compose/docker-compose.yml up -d.
3. Frontend: http://localhost:8080 (пример), API: http://localhost:8000, pgAdmin: http://localhost:5050.
4. Применить миграции: docker compose exec api alembic upgrade head.
5. (Опционально) загрузить тестовые данные через seed-скрипт или API.

## Swarm (обзор)
- Инициализация: docker swarm init.
- Сети: overlay для фронта/бэка/бд, выделенная для Traefik.
- Деплой: docker stack deploy -c infra/swarm/stack.yml worktime.
- Реплики: pi и web с параметром eplicas, проверки здоровья.

## Далее
- Добавить compose/stack, конфиги Traefik, миграции Alembic, базовые UI-экраны.
- Подготовить GitLab CI pipeline для сборки и деплоя в Swarm.
