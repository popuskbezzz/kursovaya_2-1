# Руководство по демонстрации worktime-platform

Набор шагов для локального запуска, проверки работы, демонстрации кластера Docker Swarm и CI/CD. Стиль изложен нейтрально, чтобы использовать материал в отчёте (глава 3 – практическая реализация).

## 1. Локальный запуск через docker-compose
1. Перейти в каталог `infra/` и подготовить переменные окружения:
   - скопировать `.env.example` → `.env`;
   - при необходимости скорректировать порты и креды БД.
2. Собрать и запустить сервисы в фоне:
   ```bash
   docker compose up -d
   ```
3. Проверить статус контейнеров:
   ```bash
   docker compose ps
   ```
   *Скриншот:* список контейнеров в статусе `running`.
4. Просмотреть логи (по необходимости):
   ```bash
   docker compose logs -f api
   docker compose logs -f web
   ```
5. Доступность сервисов по умолчанию:
   - Frontend (web): `http://localhost/`
   - Backend API: `http://localhost/api`, Swagger UI: `http://localhost/api/docs`
   - pgAdmin: `http://localhost/pgadmin` (учётные данные из `.env`)
   - Traefik dashboard: `http://localhost/traefik` (доступ с basic auth из `.env`)
   *Скриншот:* открытая страница Dashboard приложения и Swagger UI `/api/docs`.

## 2. Демонстрация работы приложения
1. Открыть web-интерфейс `http://localhost/`, выполнить псевдо-логин (email/имя по умолчанию).
2. В разделе «Проекты и задачи»:
   - создать проект;
   - создать задачу, привязав к проекту;
   - убедиться, что задача отображается в списке.
3. В разделе «Учёт времени»:
   - выбрать задачу;
   - создать запись времени (дата, часы, комментарий);
   - убедиться, что запись появилась в списке.
   *Скриншот:* форма учёта времени с созданной записью.
4. Продемонстрировать API через браузер Swagger UI `http://localhost/api/docs`:
   - вызвать `POST /projects`, `POST /tasks`, `POST /time-entries` с тестовыми данными;
   - вызвать `GET /tasks/{task_id}/time-entries` и показать, что запись времени отображается.
   Альтернатива — использовать `curl`:
   ```bash
   curl -X GET http://localhost/api/projects
   curl -X POST http://localhost/api/time-entries -H "Content-Type: application/json" \
     -d '{"task_id":1,"user_id":1,"work_date":"2024-01-01","hours":2,"comment":"demo"}'
   ```
   *Скриншот:* окно Swagger UI или вывод curl с успешным ответом.

## 3. Демонстрация кластерной архитектуры (Docker Swarm)
1. Проверить узлы кластера:
   ```bash
   docker node ls
   ```
   *Скриншот:* список manager/worker с их статусом.
2. Просмотреть развернутые сервисы стека:
   ```bash
   docker service ls
   ```
   Обратить внимание на реплики `worktime_api` и `worktime_web`.
   *Скриншот:* вывод `docker service ls` с количеством реплик.
3. Проверить распределение задач конкретного сервиса:
   ```bash
   docker service ps worktime_api
   docker service ps worktime_web
   ```
   Пояснить, что контейнеры разнесены по worker-узлам благодаря overlay-сети и constraint-меткам.
   *Скриншот:* вывод `docker service ps` с узлами размещения.
4. При необходимости показать сетевое взаимодействие:
   ```bash
   docker network ls
   docker network inspect worktime_proxy
   ```
   Кратко объяснить: overlay-сеть `proxy` — для публикации через Traefik; `backend` — приватная сеть для `api` ↔ `db/pgadmin`.

## 4. Демонстрация CI/CD (GitLab)
1. Пояснить, какие события запускают pipeline:
   - push или merge в основную ветку (`$CI_DEFAULT_BRANCH`) — сборка и деплой;
   - push в любую ветку — только сборка образов (по правилам в `.gitlab-ci.yml`).
2. Стадии pipeline:
   - `build_api` и `build_web`: сборка Docker-образов, тегирование `latest` и `COMMIT_SHA`, пуш в GitLab Registry.
   - `deploy_stack`: SSH на manager-узел, `docker stack deploy -c stack-worktime.yml $STACK_NAME`, затем `docker service ls`.
   *Скриншот:* завершённый pipeline в GitLab с этапами build/deploy.
3. Признаки успешного деплоя:
   - все стадии прошли без ошибок;
   - на сервере `docker service ls` показывает обновлённые образы (по SHA/времени обновления);
   - приложение доступно по хосту кластера (frontend, API `/api/docs`, Traefik/pgAdmin — по маршрутам).

## Возможные направления развития платформы
- Добавить полноценную аутентификацию и авторизацию (JWT, роли) с интеграцией в UI.
- Реализовать расширенные отчёты: агрегаты по периодам, экспорт в CSV/XLSX, дашборды Grafana.
- Интеграция с LDAP/FreeIPA для корпоративной аутентификации.
- Настроить мониторинг и алертинг (Prometheus + Alertmanager, метрики Traefik/БД/приложения).
- Добавить e2e-тесты для UI и contract-тесты для API (Postman/Newman или Pact).
