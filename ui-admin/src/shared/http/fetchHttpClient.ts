// src/shared/http/fetchHttpClient.ts
import type { HttpClient } from "./HttpClient";
import { HttpError } from "./HttpError";
import { authProvider } from "../../auth/authProvider";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3002";

const getToken = () => localStorage.getItem("token");

const buildError = (status: number, body: any): HttpError => {
  let type: HttpError["type"] = "unknown";
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
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${getToken() ?? ""}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const responseBody = await res.json().catch(() => ({}));
    const error = buildError(res.status, responseBody);

    if (error.type === "auth") {
      await authProvider.checkError({ status: res.status });
    }

    throw error;
  }

  return res.json().catch(() => null);
};

export const httpClient: HttpClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
