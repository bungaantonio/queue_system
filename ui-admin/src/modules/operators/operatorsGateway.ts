import { httpClient } from "../../core/http/apiClient";
import type { Operator } from "./types";

const BASE = "/operators";

export const operatorsGateway = {
  getList: async (): Promise<Operator[]> => httpClient.get<Operator[]>(BASE),

  getOne: async (id: number): Promise<Operator> =>
    httpClient.get<Operator>(`${BASE}/${id}`),

  create: async (data: Omit<Operator, "id">): Promise<Operator> =>
    httpClient.post<Operator>(BASE, data),

  update: async (id: number, data: Partial<Operator>): Promise<Operator> =>
    httpClient.put<Operator>(`${BASE}/${id}`, data),

  delete: async (id: number): Promise<void> =>
    httpClient.delete(`${BASE}/${id}`),
};
