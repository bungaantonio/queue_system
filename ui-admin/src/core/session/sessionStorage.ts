export const sessionStore = {
  setToken: (token: string) => sessionStorage.setItem("token", token),
  getToken: () => sessionStorage.getItem("token"),
  removeToken: () => sessionStorage.removeItem("token"),

  setUser: (username: string, role: string) => {
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);
  },

  getUser: () => {
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    if (!username || !role) return null;

    return { username, role };
  },

  clear: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");
  },
};