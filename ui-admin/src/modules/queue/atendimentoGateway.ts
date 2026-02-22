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
    return mutateAndSync("/queue/call-next");
  },

  finish: async (): Promise<QueueSnapshot> => {
    return mutateAndSync("/queue/finish");
  },

  skip: async (): Promise<QueueSnapshot> => {
    return mutateAndSync("/queue/skip");
  },

  cancel: async (item_id: number): Promise<QueueSnapshot> => {
    return mutateAndSync("/queue/cancel", {
      item_id,
    });
  },

  requeue: async (
    user_id: number,
    attendance_type: string,
  ): Promise<QueueSnapshot> => {
    return mutateAndSync("/queue/requeue", {
      user_id,
      attendance_type,
    });
  },
};

const mutateAndSync = async (
  path: string,
  body?: Record<string, unknown>,
): Promise<QueueSnapshot> => {
  await httpClient.post<unknown>(path, body);

  const payload = await httpClient.get<unknown>("/queue/waiting-and-called");
  const snapshot = normalizeQueueSnapshot(payload);
  if (!snapshot) {
    throw new Error(`Resposta inválida ao sincronizar fila após ${path}`);
  }

  return snapshot;
};
