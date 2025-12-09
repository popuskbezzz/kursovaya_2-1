import { FormEvent, useEffect, useState } from "react";
import { createProject, listProjects } from "../api/projects";
import { createTask, listTasks } from "../api/tasks";
import { seedDemo } from "../api/health";
import { Project, Task, User } from "../types/models";

interface DashboardProps {
  user: User;
}

// Дашборд: показывает проекты, связанные задачи и даёт быстрые формы создания.
export default function DashboardPage({ user }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [error, setError] = useState<string>("");

  // Формы
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProjectId, setTaskProjectId] = useState<number | "">("");
  const [taskAssigneeId, setTaskAssigneeId] = useState<number | "">(user.id);
  const [seedInfo, setSeedInfo] = useState<string>("");

  useEffect(() => {
    Promise.all([listProjects(), listTasks()])
      .then(([proj, task]) => {
        setProjects(proj);
        setTasks(task);
      })
      .catch((err) => setError(err.message));
  }, []);

  const tasksToShow = selectedProjectId
    ? tasks.filter((t) => t.project_id === selectedProjectId)
    : tasks;

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!projectName.trim()) return;
    const created = await createProject({ name: projectName, description: projectDescription });
    setProjects((prev) => [...prev, created]);
    setProjectName("");
    setProjectDescription("");
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!taskTitle || !taskProjectId) return;
    const created = await createTask({
      title: taskTitle,
      description: taskDescription,
      project_id: Number(taskProjectId),
      assignee_id: taskAssigneeId === "" ? undefined : Number(taskAssigneeId),
    });
    setTasks((prev) => [...prev, created]);
    setTaskTitle("");
    setTaskDescription("");
    setTaskProjectId("");
    setTaskAssigneeId(user.id);
  };

  const handleSeedDemo = async () => {
    setSeedInfo("");
    try {
      const res = await seedDemo();
      setSeedInfo(JSON.stringify(res));
    } catch (err) {
      setSeedInfo((err as Error).message);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Проекты</h2>
        <p className="muted">Выберите проект, чтобы увидеть связанные задачи, или создайте новый.</p>
        <form onSubmit={handleCreateProject} className="form-grid" style={{ marginBottom: 12 }}>
          <input
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Название проекта"
          />
          <input
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Описание (опционально)"
          />
          <button type="submit">Создать проект</button>
        </form>
        <div className="list">
          {projects.map((p) => (
            <button
              key={p.id}
              className={`list-item ${selectedProjectId === p.id ? "active" : ""}`}
              onClick={() => setSelectedProjectId(selectedProjectId === p.id ? "" : p.id)}
            >
              <div className="list-item__title">{p.name}</div>
              {p.description && <div className="list-item__subtitle">{p.description}</div>}
            </button>
          ))}
          {projects.length === 0 && <p>Проектов пока нет.</p>}
        </div>
      </div>

      <div className="card">
        <h2>Задачи</h2>
        <p className="muted">
          {selectedProjectId ? `Фильтр по проекту #${selectedProjectId}` : "Показаны все задачи."}
        </p>
        <form onSubmit={handleCreateTask} className="form-grid" style={{ marginBottom: 12 }}>
          <input
            required
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Заголовок задачи"
          />
          <input
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Описание (опционально)"
          />
          <select
            required
            value={taskProjectId}
            onChange={(e) => setTaskProjectId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Проект</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={taskAssigneeId}
            onChange={(e) => setTaskAssigneeId(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="ID исполнителя"
          />
          <button type="submit">Создать задачу</button>
        </form>
        <div className="list">
          {tasksToShow.map((t) => (
            <div key={t.id} className="list-item">
              <div className="list-item__title">{t.title}</div>
              <div className="list-item__subtitle">
                Статус: {t.status} · Проект #{t.project_id}
                {t.assignee_id ? ` · Исполнитель #${t.assignee_id}` : ""}
              </div>
              {t.description && <div className="muted">{t.description}</div>}
            </div>
          ))}
          {tasksToShow.length === 0 && <p>Для выбранного проекта задач нет.</p>}
        </div>
      </div>

      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <h2>Демо-данные</h2>
        <p className="muted">Можно автоматически создать пользователя, проект, задачу и запись времени.</p>
        <button onClick={handleSeedDemo}>Создать демо-данные</button>
        {seedInfo && <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{seedInfo}</pre>}
      </div>

      {error && (
        <div className="card" style={{ gridColumn: "1 / -1", color: "red" }}>
          Ошибка загрузки: {error}
        </div>
      )}
    </div>
  );
}
