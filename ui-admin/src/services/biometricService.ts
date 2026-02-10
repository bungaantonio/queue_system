import { httpClient } from "../core/http/apiClient";

export const biometricService = {
  requestCapture: (operatorId: number) =>
    httpClient.post<{ session_id: string }>(
      `/biometrics/request-capture/${operatorId}`,
    ),

  fetchHash: async (sessionId: string) => {
    try {
      const res = await httpClient.get<{ biometric_id: string }>(
        `/biometrics/fetch-hash/${sessionId}`,
      );
      return res.biometric_id;
    } catch (e: any) {
      if (e.status === 404) return null;
      throw e;
    }
  },
};
