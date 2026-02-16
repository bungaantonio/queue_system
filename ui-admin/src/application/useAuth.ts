// src/application/useAuth.ts
import { useState } from "react";
import { sessionStore } from "../core/session/sessionStorage";
import { adminAuthProvider } from "./adminAuthProvider";

export const useAuth = () => {
  const [user, setUser] = useState(sessionStore.getUser());

  const login = async (username: string, password: string) => {
    await adminAuthProvider.login({ username, password });
    setUser(sessionStore.getUser());
  };

  const logout = async () => {
    await adminAuthProvider.logout();
    setUser(null);
  };

  const refresh = async () => {
    try {
      await adminAuthProvider.refresh();
      setUser(sessionStore.getUser());
    } catch {
      setUser(null);
    }
  };

  return { user, login, logout, refresh, role: user?.role || null };
};
