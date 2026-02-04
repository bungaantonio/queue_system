import { sessionStorage } from "../session/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_PREFIX = "/api/v1";

const request = async (method: string, path: string, body?: unknown) => {
  const token = sessionStorage.getToken();
  const url = `${BASE_URL}${API_PREFIX}${path}`; // Garante /api/v1 em tudo

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw { status: res.status, message: errorBody.detail || "Erro na API" };
  }

  return res.json().catch(() => null);
};

export const httpClient = {
  get: <T>(path: string) => request("GET", path) as Promise<T>,
  post: <T>(path: string, body?: unknown) =>
    request("POST", path, body) as Promise<T>,
  put: <T>(path: string, body?: unknown) =>
    request("PUT", path, body) as Promise<T>,
  delete: (path: string) => request("DELETE", path),
};
