import { sessionStore } from "../session/sessionStorage";
import { CONFIG } from "../config/config";
import { ApiError } from "./ApiError";
import { getApiPayload } from "../../application/auth.types";
import type { HttpPort } from "./http.types";

const parseJSON = async (res: Response): Promise<unknown> => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const parseResponseData = async <T>(res: Response): Promise<T> => {
  if (res.status === 204) return undefined as T;
  const payload = await parseJSON(res);
  return getApiPayload<T>(payload);
};

const extractAccessToken = (payload: unknown): string | null => {
  const data = getApiPayload<{ access_token?: string }>(payload);
  return data?.access_token ?? null;
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = sessionStore.getRefreshToken();
  if (!refreshToken) {
    sessionStore.clear();
    throw new ApiError(401, { detail: "Sessão expirada" });
  }

  const refreshRes = await fetch(`${CONFIG.AUTH_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const refreshPayload = await parseJSON(refreshRes);
  if (!refreshRes.ok) {
    sessionStore.clear();
    throw new ApiError(401, refreshPayload, "Sessão expirada");
  }

  const newAccessToken = extractAccessToken(refreshPayload);
  if (!newAccessToken) {
    sessionStore.clear();
    throw new ApiError(500, refreshPayload, "Resposta de refresh inválida");
  }

  sessionStore.setAccessToken(newAccessToken);
  return newAccessToken;
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> => {
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

  let token = sessionStore.getAccessToken();
  if (!token) {
    token = await refreshAccessToken();
  }

  let res = await fetchWithToken(token);

  if (res.status === 401) {
    token = await refreshAccessToken();
    res = await fetchWithToken(token);
    if (!res.ok) {
      const errorBody = await parseJSON(res);
      throw new ApiError(res.status, errorBody);
    }
  }

  if (!res.ok) {
    const errorBody = await parseJSON(res);
    throw new ApiError(res.status, errorBody);
  }

  return parseResponseData<T>(res);
};

export const httpClient: HttpPort = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: (path: string) => request<void>("DELETE", path),
};
