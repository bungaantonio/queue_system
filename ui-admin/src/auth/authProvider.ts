// src/auth/authProvider.ts
const API_URL = "/auth/login";

interface LoginResponse {
  access_token: string;
  role?: "admin" | "attendant" | "auditor";
}

const parseJSON = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const authProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponse = await parseJSON(res);

    if (!res.ok) {
      throw new Error((data as any)?.detail || "Credenciais inválidas");
    }

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role ?? "attendant");
    localStorage.setItem("username", username);

    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) return Promise.reject(new Error("Não autenticado"));
    // opcional: decodificar JWT e validar exp
    return Promise.resolve();
  },

  checkError: async (error: { status: number }) => {
    if (error.status === 401) {
      localStorage.clear();
      return Promise.reject(new Error("Sessão expirada"));
    }
    if (error.status === 403) {
      return Promise.reject(new Error("Não autorizado"));
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  },

  getIdentity: () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (!username)
      return Promise.reject(new Error("Identidade não encontrada"));
    return Promise.resolve({
      id: username,
      fullName: username,
      role: role ?? "attendant",
    });
  },
};
