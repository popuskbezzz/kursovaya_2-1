import { request } from "./client";

export async function healthcheck(): Promise<{ status: string }> {
  return request<{ status: string }>("/health");
}

export async function seedDemo(): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>("/demo/seed", { method: "POST" });
}
