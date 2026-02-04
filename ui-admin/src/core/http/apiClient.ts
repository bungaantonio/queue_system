// src/core/http/apiClient.ts
import { getToken } from "../session/sessionStorage";
import { HttpError, HttpErrorType } from "./ApiError";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3002";

const buildError = (status: number, body: any): HttpError => {
  let type: HttpErrorType = "unknown";
  let message = "Erro na operação";
  let details: any;

  if (status === 401 || status === 403) {
    type = "auth";
    message = "Não autorizado";
  } else if (status === 422 && Array.isArray(body?.detail)) {
    type = "validation";
    message = "Erro de validação";
    details = body.detail;
  } else if (typeof body?.detail === "string") {
    type = "business";
    message = body.detail;
  }

  const error = new Error(message) as HttpError;
  error.status = status;
  error.type = type;
  error.details = details;
  return error;
};

const request = async (method: string, path: string, body?: unknown) => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    throw buildError(res.status, responseBody);
  }

  return res.json().catch(() => null);
};

export const httpClient = {
  get: <T>(path: string) => request("GET", path) as Promise<T>,
  post: <T>(path: string, body?: unknown) =>
    request("POST", path, body) as Promise<T>,
  put: <T>(path: string, body?: unknown) =>
    request("PUT", path, body) as Promise<T>,
  delete: <T>(path: string) => request("DELETE", path) as Promise<T>,
};
