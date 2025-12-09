/**
 * Базовый HTTP-клиент. Все запросы идут на backend `api`.
 * VITE_API_URL ожидается с префиксом `/api` (например, http://localhost/api).
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export { API_BASE_URL, request };
