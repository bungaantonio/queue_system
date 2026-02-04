import { httpClient } from "../../core/http/apiClient";
import type { QueueUser } from "./atendimento.types";

const BASE = "/api/v1/queue";

export const atendimentoGateway = {
  getList: async (): Promise<QueueUser[]> =>
    httpClient.get<QueueUser[]>(`${BASE}/waiting-and-called`),

  getOne: async (id: number): Promise<QueueUser> =>
    httpClient.get<QueueUser>(`${BASE}/${id}`),

  create: async (data: any): Promise<QueueUser> =>
    httpClient.post<QueueUser>(`${BASE}/requeue`, data),

  update: async (id: number, data: any): Promise<QueueUser> =>
    httpClient.post<QueueUser>(`${BASE}/finish`, data),

  delete: async (id: number): Promise<void> =>
    httpClient.post(`${BASE}/cancel`, { item_id: id }),
};
