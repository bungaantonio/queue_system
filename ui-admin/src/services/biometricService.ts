import { httpClient } from "../core/http/apiClient";

export const biometricService = {
  // Registra captura via middleware; envia session_id + credential_id no corpo
  registerCapture: (payload: { session_id: string; credential_id: string }) =>
    httpClient.post<{ status: string }>(
      "/credential/register-capture",
      payload,
    ),

  // Busca hash/identificador da credencial
  fetchHash: async (sessionId: string) => {
    try {
      const res = await httpClient.get<{ identifier: string }>(
        `/credential/fetch-identifier/${sessionId}`,
      );
      return res.identifier;
    } catch (e: any) {
      if (e.status === 404) return null;
      throw e;
    }
  },
};
