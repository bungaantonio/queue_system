// src/modules/atendimento/atendimentoGateway.ts
import { httpClient } from "../../core/http/apiClient";
import { normalizeQueueSnapshot } from "./atendimento.types";
import type { QueueSnapshot } from "./atendimento.types";

export const atendimentoGateway = {
  listWaitingAndCalled: async (): Promise<QueueSnapshot> => {
    const payload = await httpClient.get<unknown>("/queue/waiting-and-called");
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/waiting-and-called");
    }
    return snapshot;
  },

  callNext: async (): Promise<QueueSnapshot> => {
    const payload = await httpClient.post<unknown>("/queue/call-next");
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/call-next");
    }
    return snapshot;
  },

  finish: async (): Promise<QueueSnapshot> => {
    const payload = await httpClient.post<unknown>("/queue/finish");
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/finish");
    }
    return snapshot;
  },

  skip: async (): Promise<QueueSnapshot> => {
    const payload = await httpClient.post<unknown>("/queue/skip");
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/skip");
    }
    return snapshot;
  },

  cancel: async (item_id: number): Promise<QueueSnapshot> => {
    const payload = await httpClient.post<unknown>("/queue/cancel", {
      item_id,
    });
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/cancel");
    }
    return snapshot;
  },

  requeue: async (
    user_id: number,
    attendance_type: string,
  ): Promise<QueueSnapshot> => {
    const payload = await httpClient.post<unknown>("/queue/requeue", {
      user_id,
      attendance_type,
    });
    const snapshot = normalizeQueueSnapshot(payload);
    if (!snapshot) {
      throw new Error("Resposta inválida de /queue/requeue");
    }
    return snapshot;
  },
};
