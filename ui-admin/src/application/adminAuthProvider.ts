import { sessionStore } from "../core/session/sessionStorage";
import {
  LoginData,
  LoginResponseData,
  RefreshTokenData,
  RefreshResponseData,
  UserData,
  ApiResponse,
} from "./auth.types.ts";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const adminAuthProvider = {
  login: async ({ username, password }: LoginData) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const responseData: ApiResponse<LoginResponseData> = await res.json();

    if (!res.ok) {
      throw new Error(responseData?.error?.message || "Credenciais inválidas");
    }

    // Acessando .data.access_token por causa do seu ApiResponse no backend
    const { access_token, refresh_token } = responseData.data;

    sessionStore.setAccessToken(access_token);
    sessionStore.setRefreshToken(refresh_token);

    // Salva info básica para manter estado após F5
    const user = sessionStore.getUser();
    if (user) sessionStore.setUserInfo(user.username, user.role);

    return Promise.resolve();
  },

  logout: async () => {
    const refreshToken = sessionStore.getRefreshToken();
    if (refreshToken) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: refreshToken,
        } as RefreshTokenData),
      }).catch(() => {});
    }
    sessionStore.clear();
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = sessionStore.getAccessToken();
    const refreshToken = sessionStore.getRefreshToken();

    // Se tem token em memória, está autenticado
    if (token) return Promise.resolve();

    // Se não tem token em memória mas tem Refresh Token (caso de F5)
    // Tentamos recuperar o access_token automaticamente
    if (refreshToken) {
      try {
        // Chamamos a função de refresh interna para tentar recuperar a sessão
        await adminAuthProvider.refresh();
        return Promise.resolve();
      } catch (e) {
        sessionStore.clear();
        return Promise.reject();
      }
    }

    return Promise.reject();
  },

  // Função auxiliar para renovar o token
  refresh: async () => {
    const refreshToken = sessionStore.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // O backend FastAPI corrigido espera o JSON body
      body: JSON.stringify({ refresh_token: refreshToken } as RefreshTokenData),
    });

    const responseData: ApiResponse<RefreshResponseData> = await res.json();

    if (!res.ok) {
      sessionStore.clear();
      throw new Error("Sessão expirada");
    }

    // Acessando data.data.access_token
    sessionStore.setAccessToken(responseData.data.access_token);
    return responseData.data.access_token;
  },

  checkError: async (error: { status: number }) => {
    // Se o erro for 401 (Não autorizado), tentamos o refresh
    if (error.status === 401) {
      try {
        await adminAuthProvider.refresh();
        return Promise.resolve(); // Tenta a requisição original novamente
      } catch {
        sessionStore.clear();
        return Promise.reject();
      }
    }

    if (error.status === 403) {
      return Promise.reject(new Error("Não autorizado"));
    }

    return Promise.resolve();
  },

  getPermissions: async () => {
    const user = sessionStore.getUser();
    return user?.role || null;
  },

  getIdentity: async (): Promise<
    UserData & { id: string; fullName: string }
  > => {
    const user = sessionStore.getUser();
    if (!user) throw new Error("Identidade não encontrada");
    return {
      id: user.username,
      fullName: user.username,
      role: user.role,
      username: user.username,
    };
  },
};
