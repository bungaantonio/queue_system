// src/modules/atendimento/atendimentoGateway.ts
import { httpClient } from "../../core/http/apiClient";
import type { QueueUser } from "./atendimento.types";

export const atendimentoGateway = {
  listWaitingAndCalled: async (): Promise<{
    queue: QueueUser[];
    called: QueueUser[];
    current: QueueUser | null;
  }> => httpClient.get("/queue/waiting-and-called"),

  callNext: async (): Promise<void> => httpClient.post("/queue/call-next"),

  finish: async (): Promise<void> => httpClient.post("/queue/finish"),

  skip: async (): Promise<void> => httpClient.post("/queue/skip"),

  cancel: async (item_id: number): Promise<void> =>
    httpClient.post("/queue/cancel", { item_id }),

  requeue: async (user_id: number, attendance_type: string): Promise<void> =>
    httpClient.post("/queue/requeue", {
      user_id,
      attendance_type,
    }),
};
