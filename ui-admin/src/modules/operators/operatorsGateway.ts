import { httpClient } from "../../core/http/apiClient";
import type { Operator } from "./types";

export const operatorsGateway = {
  getList: async (): Promise<Operator[]> =>
    httpClient.get<Operator[]>("/operators"),

  getOne: async (id: number): Promise<Operator> =>
    httpClient.get<Operator>(`/operators/${id}`),

  create: async (data: Omit<Operator, "id">): Promise<Operator> =>
    httpClient.post<Operator>("/operators", data),

  update: async (id: number, data: Partial<Operator>): Promise<Operator> =>
    httpClient.put<Operator>(`/operators/${id}`, data),

  deactivate: async (id: number): Promise<Operator> =>
    httpClient.patch<Operator>(`/operators/${id}/deactivate`, {}),

  activate: async (id: number): Promise<Operator> =>
    httpClient.patch<Operator>(`/operators/${id}/activate`, {}),

  delete: async (id: number): Promise<void> =>
    operatorsGateway.deactivate(id).then(() => undefined),
};
