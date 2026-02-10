// src/application/useAuth.ts
import { useState } from "react";
import { sessionStore } from "../core/session/sessionStorage";
import { adminAuthProvider } from "../application/adminAuthProvider";

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
    // tenta refresh token se existir
    try {
      await adminAuthProvider.checkError({ status: 401 });
      setUser(sessionStore.getUser());
    } catch {
      setUser(null);
    }
  };

  return { user, login, logout, refresh, role: user?.role || null };
};
