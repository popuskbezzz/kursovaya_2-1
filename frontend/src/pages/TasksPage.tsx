import { FormEvent, useEffect, useState } from "react";
import { createTask, listTasks, updateTask } from "../api/tasks";
import { listProjects } from "../api/projects";
import { Project, Task } from "../types/models";

// Страница задач: список, создание и обновление статуса.
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<number | "">("");
  const [assigneeId, setAssigneeId] = useState<number | "">("");

  useEffect(() => {
    listTasks().then(setTasks).catch(console.error);
    listProjects().then(setProjects).catch(console.error);
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;
    const payload = {
      title,
      description,
      project_id: Number(projectId),
      assignee_id: assigneeId === "" ? undefined : Number(assigneeId),
    };
    const task = await createTask(payload);
    setTasks((prev) => [...prev, task]);
    setTitle("");
    setDescription("");
    setProjectId("");
    setAssigneeId("");
  };

  const handleStatusChange = async (taskId: number, status: string) => {
    const updated = await updateTask(taskId, { status });
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
  };

  return (
    <div className="card">
      <h2>Задачи</h2>
      <form onSubmit={handleCreate} className="form-grid">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание (опционально)"
        />
        <select
          required
          value={projectId}
          onChange={(e) => setProjectId(e.target.value === "" ? "" : Number(e.target.value))}
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
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="ID исполнителя (опционально)"
        />
        <button type="submit">Создать задачу</button>
      </form>

      <div className="list" style={{ marginTop: 16 }}>
        {tasks.map((t) => (
          <div key={t.id} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{t.title}</strong> <span className="badge">{t.status}</span>
                <div style={{ color: "#475569" }}>
                  Проект #{t.project_id} {t.assignee_id ? `· Исполнитель #${t.assignee_id}` : ""}
                </div>
              </div>
              <select value={t.status} onChange={(e) => handleStatusChange(t.id, e.target.value)}>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </select>
            </div>
            {t.description && <p>{t.description}</p>}
          </div>
        ))}
        {tasks.length === 0 && <p>Пока нет задач.</p>}
      </div>
    </div>
  );
}
