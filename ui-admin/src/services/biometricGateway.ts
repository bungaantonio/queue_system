import { httpClient } from "../core/http/apiClient";

interface RequestCaptureResponse {
  session_id: string;
}

/**
 * Gateway para lidar com operações de biometria.
 */
export const biometricGateway = {
  /**
   * Solicita ao backend o início da captura biométrica para um operador.
   * @param operatorId ID do operador que está realizando a captura.
   */
  requestCapture: async (
    operatorId: number,
  ): Promise<RequestCaptureResponse> => {
    return httpClient.post<RequestCaptureResponse>(
      `/api/v1/biometrics/request-capture/${operatorId}`,
    );
  },

  /**
   * Consulta se a biometria já foi capturada e retorna o hash.
   * @param sessionId ID da sessão gerada na requestCapture.
   * @returns Hash biométrico ou null se ainda não capturado.
   */
  fetchHash: async (sessionId: string): Promise<string | null> => {
    try {
      const data = await httpClient.get<{ biometric_id: string | null }>(
        `/api/v1/biometrics/fetch-hash/${sessionId}`,
      );
      return data.biometric_id ?? null;
    } catch (err: any) {
      if (err.status === 404) return null; // Ainda não capturado
      throw err;
    }
  },
};
