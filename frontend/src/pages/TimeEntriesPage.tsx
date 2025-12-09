import { FormEvent, useState } from "react";
import { createTimeEntry, listTimeEntriesByTask } from "../api/timeEntries";
import { TimeEntry } from "../types/models";

// Учёт времени: фиксация часов и просмотр по задаче.
export default function TimeEntriesPage() {
  const [taskId, setTaskId] = useState<number | "">("");
  const [userId, setUserId] = useState<number | "">("");
  const [workDate, setWorkDate] = useState<string>("");
  const [hours, setHours] = useState<number | "">("");
  const [comment, setComment] = useState("");
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!taskId || !userId || !workDate || !hours) return;
    try {
      await createTimeEntry({
        task_id: Number(taskId),
        user_id: Number(userId),
        work_date: workDate,
        hours: Number(hours),
        comment,
      });
      const list = await listTimeEntriesByTask(Number(taskId));
      setEntries(list);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLoad = async () => {
    if (!taskId) return;
    try {
      const list = await listTimeEntriesByTask(Number(taskId));
      setEntries(list);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="card">
      <h2>Учёт времени</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="number"
          required
          value={taskId}
          onChange={(e) => setTaskId(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="ID задачи"
        />
        <input
          type="number"
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="ID пользователя"
        />
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
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={handleLoad}>Обновить список</button>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="list" style={{ marginTop: 16 }}>
        {entries.map((e) => (
          <div key={e.id} className="card">
            <div>Дата: {e.work_date}</div>
            <div>Часы: {e.hours}</div>
            <div>Пользователь: {e.user_id} · Задача: {e.task_id}</div>
            {e.comment && <div>Комментарий: {e.comment}</div>}
          </div>
        ))}
        {entries.length === 0 && <p>Записей пока нет.</p>}
      </div>
    </div>
  );
}
