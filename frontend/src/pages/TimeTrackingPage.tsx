import { FormEvent, useEffect, useMemo, useState } from "react";
import { listProjects } from "../api/projects";
import { listTasks } from "../api/tasks";
import { createTimeEntry, listTimeEntriesByTask } from "../api/timeEntries";
import { Project, Task, TimeEntry, User } from "../types/models";

interface Props {
  user: User;
}

// Экран учёта времени: форма создания записи и список записей по выбранной задаче.
export default function TimeTrackingPage({ user }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | "">("");
  const [workDate, setWorkDate] = useState<string>("");
  const [hours, setHours] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    Promise.all([listProjects(), listTasks()])
      .then(([proj, task]) => {
        setProjects(proj);
        setTasks(task);
      })
      .catch((err) => setError(err.message));
  }, []);

  const filteredTasks = useMemo(
    () => (selectedProjectId ? tasks.filter((t) => t.project_id === selectedProjectId) : tasks),
    [tasks, selectedProjectId]
  );

  const handleTaskSelect = async (taskId: number) => {
    setSelectedTaskId(taskId);
    setError("");
    try {
      const list = await listTimeEntriesByTask(taskId);
      setEntries(list);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedTaskId || !workDate || !hours) return;
    try {
      await createTimeEntry({
        task_id: Number(selectedTaskId),
        user_id: user.id,
        work_date: workDate,
        hours: Number(hours),
        comment,
      });
      setSuccess("Запись сохранена");
      setComment("");
      const list = await listTimeEntriesByTask(Number(selectedTaskId));
      setEntries(list);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2>Новая запись времени</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <select
            value={selectedProjectId}
            onChange={(e) => {
              const val = e.target.value === "" ? "" : Number(e.target.value);
              setSelectedProjectId(val);
              setSelectedTaskId("");
              setEntries([]);
            }}
          >
            <option value="">Проект (опционально для фильтра)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            required
            value={selectedTaskId}
            onChange={(e) => handleTaskSelect(Number(e.target.value))}
          >
            <option value="">Задача</option>
            {filteredTasks.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.id} · {t.title}
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
          />
          <input
            type="number"
            step="0.25"
            min="0.25"
            required
            value={hours}
            onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Часы"
          />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий (опционально)"
          />
          <button type="submit">Сохранить</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>

      <div className="card">
        <h2>Записи по задаче</h2>
        {!selectedTaskId && <p className="muted">Выберите задачу, чтобы увидеть учёт времени.</p>}
        <div className="list">
          {entries.map((e) => (
            <div key={e.id} className="list-item">
              <div className="list-item__title">
                {e.work_date} · {e.hours} ч
              </div>
              <div className="list-item__subtitle">Пользователь: {e.user_id}</div>
              {e.comment && <div className="muted">{e.comment}</div>}
            </div>
          ))}
          {selectedTaskId && entries.length === 0 && <p>Записей пока нет.</p>}
        </div>
      </div>
    </div>
  );
}
