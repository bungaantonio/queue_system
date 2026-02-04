import { sessionStorage } from "../core/session/sessionStorage";

interface LoginResponse {
  detail: string;
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
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: LoginResponse = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.detail || "Credenciais inválidas");

    sessionStorage.setToken(data.access_token);
    sessionStorage.setUser(username, data.role ?? "attendant");
    return Promise.resolve();
  },

  logout: () => {
    sessionStorage.clear();
    return Promise.resolve();
  },

  checkAuth: () => {
    const token = sessionStorage.getToken();
    if (!token) return Promise.reject(new Error("Não autenticado"));
    return Promise.resolve();
  },

  checkError: async (error: { status: number }) => {
    if (error.status === 401) {
      sessionStorage.clear();
      return Promise.reject(new Error("Sessão expirada"));
    }
    if (error.status === 403)
      return Promise.reject(new Error("Não autorizado"));
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(sessionStorage.getUser().role),
  getIdentity: () => {
    const { username, role } = sessionStorage.getUser();
    if (!username)
      return Promise.reject(new Error("Identidade não encontrada"));
    return Promise.resolve({ id: username, fullName: username, role });
  },
};
