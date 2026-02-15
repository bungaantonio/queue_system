import { sessionStore } from "../session/sessionStorage";
import { CONFIG } from "../config/config";

const request = async (method: string, path: string, body?: unknown) => {
  const token = sessionStore.getAccessToken();
  const url = `${CONFIG.API_BASE_URL}${path}`;

  const fetchWithToken = async (tok: string) =>
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tok}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  let res = await fetchWithToken(token!);

  if (res.status === 401) {
    // Tentar refresh token
    const refreshToken = sessionStore.getRefreshToken();
    if (!refreshToken) {
      sessionStore.clear();
      throw { status: 401, message: "Sessão expirada" };
    }

    const refreshRes = await fetch(`${CONFIG.AUTH_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const refreshData = await refreshRes.json();
    if (!refreshRes.ok) {
      sessionStore.clear();
      throw { status: 401, message: "Sessão expirada" };
    }

    sessionStore.setAccessToken(refreshData.access_token);

    // Repetir request original com novo token
    res = await fetchWithToken(refreshData.access_token);
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw { status: res.status, message: errorBody.detail || "Erro na API" };
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
