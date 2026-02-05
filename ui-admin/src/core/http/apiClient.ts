import { sessionStore } from "../session/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_PREFIX = "/api/v1";

const request = async (method: string, path: string, body?: unknown) => {
  let token = sessionStore.getAccessToken();
  const url = `${BASE_URL}${API_PREFIX}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Tentar refresh token automaticamente
    const refreshToken = sessionStore.getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await refreshRes.json();
      if (!refreshRes.ok) {
        sessionStore.clear();
        throw { status: 401, message: "Sessão expirada" };
      }
      sessionStore.setAccessToken(data.access_token);

      // Repetir request original com novo token
      token = data.access_token;
      const retryRes = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!retryRes.ok) {
        const errorBody = await retryRes.json().catch(() => ({}));
        throw {
          status: retryRes.status,
          message: errorBody.detail || "Erro na API",
        };
      }
      return retryRes.json();
    } else {
      sessionStore.clear();
      throw { status: 401, message: "Sessão expirada" };
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw { status: res.status, message: errorBody.detail || "Erro na API" };
  }

  return res.json();
};

export const httpClient = {
  get: <T>(path: string) => request("GET", path) as Promise<T>,
  post: <T>(path: string, body?: unknown) =>
    request("POST", path, body) as Promise<T>,
  put: <T>(path: string, body?: unknown) =>
    request("PUT", path, body) as Promise<T>,
  delete: (path: string) => request("DELETE", path) as Promise<void>,
};
