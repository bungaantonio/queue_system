// src/modules/atendimento/atendimentoGateway.ts

import { httpClient } from "../../core/http/apiClient";
import type { QueueUser } from "./atendimento.types";

const BASE = "/queue";

export const atendimentoGateway = {
  listWaitingAndCalled: async (): Promise<{
    queue: QueueUser[];
    called: QueueUser[];
    current: QueueUser | null;
  }> => httpClient.get(`${BASE}/waiting-and-called`),

  callNext: async (): Promise<void> => httpClient.post(`${BASE}/call-next`),

  finish: async (): Promise<void> => httpClient.post(`${BASE}/finish`),

  skip: async (): Promise<void> => httpClient.post(`${BASE}/skip`),

  cancel: async (item_id: number): Promise<void> =>
    httpClient.post(`${BASE}/cancel`, { item_id }),

  requeue: async (user_id: number, attendance_type: string): Promise<void> =>
    httpClient.post(`${BASE}/requeue`, {
      user_id,
      attendance_type,
    }),
};
