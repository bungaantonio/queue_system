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
    sessionStorage.setItem("access_token", token);

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.setUserInfo(decoded.username, decoded.role);
    } catch {
      // Se o token vier inválido, não sobrescrevemos dados de usuário persistidos.
    }
  },

  getAccessToken() {
    if (this.accessToken) return this.accessToken;
    const stored = sessionStorage.getItem("access_token");
    if (stored) {
      this.setAccessToken(stored);
      return stored;
    }
    return null;
  },

  setRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
  },

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  setUserInfo(username: string, role: string) {
    localStorage.setItem("user_name", username);
    localStorage.setItem("user_role", role);
  },

  getUser() {
    if (this.accessToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(this.accessToken);
        return { username: decoded.username, role: decoded.role };
      } catch {
        return null;
      }
    }

    const username = localStorage.getItem("user_name");
    const role = localStorage.getItem("user_role");
    if (username && role) return { username, role };

    return null;
  },

  clear() {
    this.accessToken = null;
    sessionStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
  },
};
