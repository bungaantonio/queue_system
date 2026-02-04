import { sessionStorage } from "../session/sessionStorage";
import { ApiError } from "./ApiError";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const request = async (method: string, path: string, body?: unknown) => {
  const token = sessionStorage.getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    throw new ApiError(res.status, responseBody);
  }

  return res.json().catch(() => null);
};

export const httpClient = {
  get: <T = any>(path: string) => request("GET", path) as Promise<T>,
  post: <T = any>(path: string, body?: unknown) =>
    request("POST", path, body) as Promise<T>,
  put: <T = any>(path: string, body?: unknown) =>
    request("PUT", path, body) as Promise<T>,
  delete: <T = any>(path: string) => request("DELETE", path) as Promise<T>,
};
