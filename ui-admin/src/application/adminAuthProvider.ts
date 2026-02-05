import { sessionStore } from "../core/session/sessionStorage";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const adminAuthProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.detail || "Credenciais inválidas");

    // Salva tokens
    sessionStore.setAccessToken(data.access_token);
    sessionStore.setRefreshToken(data.refresh_token);
    sessionStore.setUser(username, data.role!);

    return Promise.resolve();
  },

  logout: async () => {
    const refreshToken = sessionStore.getRefreshToken();
    if (refreshToken) {
      // Chama endpoint de logout real
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    sessionStore.clear();
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = sessionStore.getAccessToken();
    if (!token) throw new Error("Não autenticado");
    return Promise.resolve();
  },

  checkError: async (error: { status: number }) => {
    if (error.status === 401) {
      // Tentar refresh token
      const refreshToken = sessionStore.getRefreshToken();
      if (refreshToken) {
        try {
          const res = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error("Refresh token inválido");

          sessionStore.setAccessToken(data.access_token);
          return Promise.resolve(); // tenta refazer request
        } catch {
          sessionStore.clear();
          return Promise.reject(new Error("Sessão expirada"));
        }
      }
      sessionStore.clear();
      return Promise.reject(new Error("Sessão expirada"));
    }

    if (error.status === 403) {
      return Promise.reject(new Error("Não autorizado"));
    }

    return Promise.resolve();
  },

  getPermissions: async () => {
    const user = sessionStore.getUser();
    return user?.role || null;
  },

  getIdentity: async () => {
    const user = sessionStore.getUser();
    if (!user) throw new Error("Identidade não encontrada");
    return { id: user.username, fullName: user.username, role: user.role };
  },
};
