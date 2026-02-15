// src/modules/atendimento/atendimentoGateway.ts
import { httpClient } from "../../core/http/apiClient";
import { CONFIG } from "../../core/config/config.ts";
import type { QueueUser } from "./atendimento.types";

export const atendimentoGateway = {
  listWaitingAndCalled: async (): Promise<{
    queue: QueueUser[];
    called: QueueUser[];
    current: QueueUser | null;
  }> => httpClient.get(`${CONFIG.QUEUE_URL}/waiting-and-called`),

  callNext: async (): Promise<void> =>
    httpClient.post(`${CONFIG.QUEUE_URL}/call-next`),

  finish: async (): Promise<void> =>
    httpClient.post(`${CONFIG.QUEUE_URL}/finish`),

  skip: async (): Promise<void> => httpClient.post(`${CONFIG.QUEUE_URL}/skip`),

  cancel: async (item_id: number): Promise<void> =>
    httpClient.post(`${CONFIG.QUEUE_URL}/cancel`, { item_id }),

  requeue: async (user_id: number, attendance_type: string): Promise<void> =>
    httpClient.post(`${CONFIG.QUEUE_URL}/requeue`, {
      user_id,
      attendance_type,
    }),
};
