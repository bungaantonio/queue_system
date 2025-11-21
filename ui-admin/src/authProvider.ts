// src/authProvider.ts
interface LoginParams {
  username: string;
  password: string;
}

interface AuthProvider {
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkError: (error: any) => Promise<void>;
  getPermissions: () => Promise<string[]>;
  getIdentity: () => Promise<{ id: string; fullName: string }>;
  getAuthHeader: () => string;
}

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", username);
  },

  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  checkAuth: async () => {
    return localStorage.getItem("token")
      ? Promise.resolve()
      : Promise.reject();
  },

  checkError: async (error) => {
    // Se a API responder com 401 ou 403, força logout
    const status = error.status || (error.response && error.response.status);
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: async () => {
    // Podes expandir isto para roles
    return Promise.resolve([]);
  },

  getIdentity: async () => {
    const username = localStorage.getItem("username");
    return Promise.resolve({ id: username || "", fullName: username || "" });
  },

  getAuthHeader: () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : "";
  },
};

export default authProvider;
