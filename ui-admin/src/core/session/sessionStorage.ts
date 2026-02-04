export const sessionStorage = {
  setToken: (token: string) => localStorage.setItem("token", token),
  getToken: () => localStorage.getItem("token"),
  removeToken: () => localStorage.removeItem("token"),

  setUser: (username: string, role: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
  },
  getUser: () => ({
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role") ?? "attendant",
  }),
  clear: () => localStorage.clear(),
};
