import { jwtDecode } from "jwt-decode";

export const sessionStore = {
  // Access token: agora só em memória
  accessToken: null as string | null,

  setAccessToken(token: string) {
    this.accessToken = token;
  },
  getAccessToken() {
    return this.accessToken;
  },
  clearAccessToken() {
    this.accessToken = null;
  },

  // Refresh token: persistente
  setRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
  },
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },
  clearRefreshToken() {
    localStorage.removeItem("refresh_token");
  },

  // Usuário
  setUser(username: string, role: string) {
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
  },
  getUser() {
    if (!this.accessToken) return null;
    try {
      const decoded: { username: string; role: string } = jwtDecode(
        this.accessToken,
      );
      return { username: decoded.username, role: decoded.role };
    } catch {
      return null;
    }
  },

  clear() {
    this.clearAccessToken();
    this.clearRefreshToken();
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  },
};
