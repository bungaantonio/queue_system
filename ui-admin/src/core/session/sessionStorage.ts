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
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (!username || !role) return null;
    return { username, role };
  },

  clear() {
    this.clearAccessToken();
    this.clearRefreshToken();
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  },
};
