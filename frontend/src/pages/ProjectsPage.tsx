import { FormEvent, useEffect, useState } from "react";
import { createProject, listProjects } from "../api/projects";
import { Project } from "../types/models";

// Страница проектов: список + простая форма создания.
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    listProjects().then(setProjects).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const project = await createProject({ name, description });
    setProjects((prev) => [...prev, project]);
    setName("");
    setDescription("");
  };

  return (
    <div className="card">
      <h2>Проекты</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название проекта"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание (опционально)"
        />
        <button type="submit">Создать</button>
      </form>
      <div className="list" style={{ marginTop: 16 }}>
        {projects.map((p) => (
          <div key={p.id} className="card">
            <strong>{p.name}</strong>
            {p.description && <div style={{ marginTop: 4 }}>{p.description}</div>}
          </div>
        ))}
        {projects.length === 0 && <p>Пока нет проектов.</p>}
      </div>
    </div>
  );
}
