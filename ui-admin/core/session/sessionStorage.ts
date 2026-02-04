// src/core/session/sessionStorage.ts
export const TOKEN_KEY = "token";
export const ROLE_KEY = "role";
export const USERNAME_KEY = "username";

export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? "";
export const getRole = () => localStorage.getItem(ROLE_KEY) ?? "attendant";
export const getUsername = () => localStorage.getItem(USERNAME_KEY) ?? "";

export const setSession = (token: string, role: string, username: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USERNAME_KEY, username);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
};
