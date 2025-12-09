import { request } from "./client";
import { Task } from "../types/models";

export async function listTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

export async function createTask(payload: {
  title: string;
  description?: string;
  status?: string;
  project_id: number;
  assignee_id?: number | null;
}): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(
  taskId: number,
  payload: Partial<{ title: string; description?: string; status?: string; assignee_id?: number | null }>
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
