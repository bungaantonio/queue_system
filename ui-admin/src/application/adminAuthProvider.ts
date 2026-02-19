import { sessionStore } from "../core/session/sessionStorage";
import { CONFIG } from "../core/config/config";
import { ApiError } from "../core/http/ApiError";
import {
  LoginData,
  LoginResponseData,
  RefreshTokenData,
  RefreshResponseData,
  UserData,
  getApiPayload,
} from "./auth.types.ts";

const parseJSON = async (res: Response): Promise<unknown> => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") return fallback;
  const body = payload as Record<string, unknown>;
  const error = body.error as Record<string, unknown> | undefined;
  if (typeof error?.message === "string") return error.message;
  if (typeof body.detail === "string") return body.detail;
  if (typeof body.message === "string") return body.message;
  return fallback;
};

export const adminAuthProvider = {
  login: async ({ username, password }: LoginData) => {
    let res: Response;
    try {
      res = await fetch(`${CONFIG.AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
    } catch {
      throw new ApiError(
        0,
        { detail: "Servidor indisponível" },
        "Servidor indisponível",
      );
    }

    const payload = await parseJSON(res);

    if (!res.ok) {
      throw new ApiError(
        res.status,
        payload,
        getErrorMessage(payload, "Credenciais inválidas"),
      );
    }

    const data = getApiPayload<LoginResponseData>(payload);
    if (!data?.access_token || !data?.refresh_token) {
      throw new ApiError(500, payload, "Resposta de login inválida");
    }

    sessionStore.setAccessToken(data.access_token);
    sessionStore.setRefreshToken(data.refresh_token);

    return Promise.resolve();
  },

  logout: async () => {
    const refreshToken = sessionStore.getRefreshToken();
    if (refreshToken) {
      await fetch(`${CONFIG.AUTH_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: refreshToken,
        } as RefreshTokenData),
      }).catch(() => {});
    }
    sessionStore.clear();
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = sessionStore.getAccessToken();
    const refreshToken = sessionStore.getRefreshToken();

    if (token) return Promise.resolve();

    if (refreshToken) {
      try {
        await adminAuthProvider.refresh();
        return Promise.resolve();
      } catch {
        sessionStore.clear();
        return Promise.reject(new ApiError(401, { detail: "Sessão expirada" }));
      }
    }

    return Promise.reject(new ApiError(401, { detail: "Não autenticado" }));
  },

  refresh: async () => {
    const refreshToken = sessionStore.getRefreshToken();
    if (!refreshToken) {
      throw new ApiError(401, { detail: "Sessão expirada" });
    }

    const res = await fetch(`${CONFIG.AUTH_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken } as RefreshTokenData),
    });

    const payload = await parseJSON(res);

    if (!res.ok) {
      sessionStore.clear();
      throw new ApiError(res.status, payload, "Sessão expirada");
    }

    const data = getApiPayload<RefreshResponseData>(payload);
    if (!data?.access_token) {
      sessionStore.clear();
      throw new ApiError(500, payload, "Resposta de refresh inválida");
    }

    sessionStore.setAccessToken(data.access_token);
    return data.access_token;
  },

  checkError: async (error: { status: number }) => {
    if (error.status === 401) {
      try {
        await adminAuthProvider.refresh();
        return Promise.resolve();
      } catch {
        sessionStore.clear();
        return Promise.reject(new ApiError(401, { detail: "Sessão expirada" }));
      }
    }

    if (error.status === 403) {
      return Promise.reject(new ApiError(403, { detail: "Não autorizado" }));
    }

    return Promise.resolve();
  },

  getPermissions: async () => {
    const user = sessionStore.getUser();
    return user?.role || null;
  },

  getIdentity: async (): Promise<
    UserData & { id: string; fullName: string }
  > => {
    const user = sessionStore.getUser();
    if (!user) throw new Error("Identidade não encontrada");
    return {
      id: user.username,
      fullName: user.username,
      role: user.role,
      username: user.username,
    };
  },
};
