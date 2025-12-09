import { request } from "./client";
import { TimeEntry } from "../types/models";

export async function createTimeEntry(payload: {
  task_id: number;
  user_id: number;
  work_date: string;
  hours: number;
  comment?: string;
}): Promise<TimeEntry> {
  return request<TimeEntry>("/time-entries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listTimeEntriesByTask(taskId: number): Promise<TimeEntry[]> {
  return request<TimeEntry[]>(`/tasks/${taskId}/time-entries`);
}
