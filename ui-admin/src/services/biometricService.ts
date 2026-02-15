import { httpClient } from "../core/http/apiClient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: any | null;
}

export const biometricService = {
  requestCapture: async (operatorId: number) => {
    try {
      const res = await httpClient.post<ApiResponse<{ session_id: string }>>(
        `/credential/request-capture/${operatorId}`,
      );
      return res.data;
    } catch (e: any) {
      if (e.status === 409) {
        console.warn("Sessão já existe para este operador. Continuando...");
      } else {
        console.error("Erro ao criar sessão de captura:", e);
      }
      return { session_id: crypto.randomUUID() }; // Gera um session_id temporário para continuar o fluxo
    }
  },

  // Busca hash/identificador da credencial
  fetchHash: async (sessionId: string) => {
    try {
      const res = await httpClient.get<ApiResponse<{ identifier: string }>>(
        `/credential/fetch-identifier/${sessionId}`,
      );
      return res.data.identifier;
    } catch (e: any) {
      if (e.status === 404) return null;
      throw e;
    }
  },
};
