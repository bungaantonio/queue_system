import { sessionStore } from "../core/session/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

interface LoginResponse {
  detail: string;
  access_token: string;
  role?: "admin" | "attendant" | "auditor";
}

let sessionInvalidated = false;

export const adminAuthProvider = {
  login: async ({ username, password }: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data?.detail || "Credenciais inválidas");

    sessionStore.setToken(data.access_token);
    sessionStore.setUser(username, data.role!);

    sessionInvalidated = false;
    return Promise.resolve();
  },

  logout: () => {
    sessionStore.clear();
    sessionInvalidated = true;
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = sessionStore.getToken();

    // Permitir página de login sem rejeitar
    if (window.location.pathname === "/login") {
      return Promise.resolve();
    }

    return token
      ? Promise.resolve()
      : Promise.reject(new Error("Não autenticado"));
  },

  checkError: async (error: { status: number }) => {
    // 401 → token inválido, expirado ou inexistente
    if (error.status === 401) {
      if (!sessionInvalidated) {
        sessionInvalidated = true;
        sessionStore.clear();
      }
      return Promise.reject(new Error("Sessão expirada"));
    }

    // 403 → usuário está logado, mas sem permissão; NÃO limpa a sessão
    if (error.status === 403) {
      return Promise.reject(new Error("Não autorizado"));
    }

    return Promise.resolve();
  },

  getPermissions: () => {
    const user = sessionStore.getUser();
    return Promise.resolve(user ? user.role : null);
  },

  getIdentity: () => {
    const user = sessionStore.getUser();
    if (!user) return Promise.reject(new Error("Identidade não encontrada"));
    return Promise.resolve({ id: user.username, fullName: user.username, role: user.role });
  },
};