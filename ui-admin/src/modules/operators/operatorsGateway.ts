import { httpClient } from "../../core/http/apiClient";
import { CONFIG } from "../../core/config/config.ts";
import type { Operator } from "./types";

export const operatorsGateway = {
  getList: async (): Promise<Operator[]> =>
    httpClient.get<Operator[]>(CONFIG.OPERATORS_URL),

  getOne: async (id: number): Promise<Operator> =>
    httpClient.get<Operator>(`${CONFIG.OPERATORS_URL}/${id}`),

  create: async (data: Omit<Operator, "id">): Promise<Operator> =>
    httpClient.post<Operator>(CONFIG.OPERATORS_URL, data),

  update: async (id: number, data: Partial<Operator>): Promise<Operator> =>
    httpClient.put<Operator>(`${CONFIG.OPERATORS_URL}/${id}`, data),

  delete: async (id: number): Promise<void> =>
    httpClient.delete(`${CONFIG.OPERATORS_URL}/${id}`),
};
