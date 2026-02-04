// src/application/adminAuthProvider.ts
import { httpClient } from "../core/http/apiClient";
import {
  setSession,
  clearSession,
  getRole,
  getUsername,
} from "../core/session/sessionStorage";

interface LoginResponse {
  access_token: string;
  role?: "admin" | "attendant" | "auditor";
}

export const adminAuthProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const data: LoginResponse = await httpClient.post<LoginResponse>(
      "/auth/login",
      { username, password },
    );
    setSession(data.access_token, data.role ?? "attendant", username);
  },

  logout: async () => {
    clearSession();
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Não autenticado");
    return Promise.resolve();
  },

  getPermissions: async () => getRole(),

  getIdentity: async () => {
    const username = getUsername();
    const role = getRole();
    if (!username) throw new Error("Identidade não encontrada");
    return { id: username, fullName: username, role };
  },

  checkError: async (error: { status: number }) => {
    if (error.status === 401) clearSession();
    if (error.status === 401) throw new Error("Sessão expirada");
    if (error.status === 403) throw new Error("Não autorizado");
  },
};
