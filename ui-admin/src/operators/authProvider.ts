const API_URL = "http://127.0.0.1:8000/auth/login";

export const authProvider = {
  login: async ({ username, password }: { username: string; password: string }) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || "Credenciais inválidas");
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role || "attendant");
    localStorage.setItem("username", username);

    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("token") ? Promise.resolve() : Promise.reject(new Error("Não autenticado")),

  checkError: async (error: any) => {
    if (error.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
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

    if (!username) {
      return Promise.reject(new Error("Identidade não encontrada"));
    }

    return Promise.resolve({
      fullName: username,
      role: role || "attendant",
    });
  },
};
