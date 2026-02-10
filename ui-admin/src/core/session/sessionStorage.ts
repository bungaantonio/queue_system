import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username: string;
  role: string;
  exp: number;
}

export const sessionStore = {
  accessToken: null as string | null,

  setAccessToken(token: string) {
    this.accessToken = token;
  },

  getAccessToken() {
    return this.accessToken;
  },

  setRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
  },

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  // Útil para persistir o username/role mesmo após F5,
  // já que o accessToken em memória some.
  setUserInfo(username: string, role: string) {
    localStorage.setItem("user_name", username);
    localStorage.setItem("user_role", role);
  },

  getUser() {
    // Tenta pegar do token em memória
    if (this.accessToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(this.accessToken);
        return { username: decoded.username, role: decoded.role };
      } catch {
        return null;
      }
    }

    // Fallback para localStorage se a memória estiver vazia (pós-F5)
    const username = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");
    if (username && role) return { username, role };

    return null;
  },

  clear() {
    this.accessToken = null;
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
  },
};
