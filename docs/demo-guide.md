# Руководство по демонстрации worktime-platform (актуально)

## 1. Локальный запуск через docker-compose
1. Перейти в каталог `infra/` и подготовить `.env`:
   - `copy .env.example .env`
   - убедиться, что `VITE_API_URL=/api`, `TRAEFIK_BASIC_AUTH=admin:$$apr1$$Y9k5Uj1O$$TtyS4cYvhha3U07wpWQ3X.`
2. Запуск с пересборкой и очисткой: `docker compose down -v && docker compose up --build -d`
3. Применить миграции: `docker compose run --rm api alembic upgrade head`
4. Проверить доступность:
   - UI: http://localhost/
   - API: http://localhost/api/health и http://localhost/api/docs
   - Traefik: http://localhost/traefik/ (admin/admin)
   - pgAdmin: http://localhost/pgadmin/ (из .env, сервер добавить: host=db, port=5432, user/pass из .env)

## 2. Демонстрация работы приложения
1. Войти в UI (любой email/имя для демо-логина).
2. Дашборд:
   - создать проект (форма на странице);
   - создать задачу, привязав к проекту;
   - отфильтровать задачи по проекту.
3. Учёт времени:
   - выбрать задачу, заполнить дату/часы/комментарий, сохранить;
   - убедиться, что запись появилась в списке.
4. Демо-данные: нажать «Создать демо-данные» (создаст пользователя, проект, задачу, запись времени). 
   Скриншоты: дашборд с проектами/задачами, экран учёта времени, ответ API в Swagger.

## 3. Проверка API напрямую
- `curl http://localhost/api/health`
- `curl http://localhost/api/projects`
- `curl -X POST http://localhost/api/projects -H "Content-Type: application/json" -d '{"name":"Demo","description":"test"}'`

## 4. Демонстрация Swarm (если нужно)
1. `docker swarm init` (на manager).
2. `docker stack deploy -c infra/stack-worktime.yml worktime`.
3. `docker service ls`, `docker service ps worktime_api`, `docker node ls` (скриншоты: распределение реплик).

## 5. Демонстрация CI/CD (GitLab)
- Триггер: push в основную ветку → стадии build_api, build_web, deploy_stack.
- Проверка: успешный pipeline, `docker service ls` на manager показывает обновлённые сервисы.

## 6. Где делать скриншоты
- UI (дашборд, задачи, учёт времени).
- Swagger `/api/docs` с успешным вызовом.
- Traefik dashboard `/traefik/` (после авторизации).
- pgAdmin главная страница.
- Вывод `docker compose ps` и `docker service ls` (для Swarm).
