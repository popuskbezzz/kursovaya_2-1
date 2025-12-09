export type Role = "admin" | "manager" | "employee" | string;

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  project_id: number;
  assignee_id?: number | null;
}

export interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  work_date: string;
  hours: number;
  comment?: string | null;
}
