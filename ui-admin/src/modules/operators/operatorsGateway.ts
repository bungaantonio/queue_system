import { httpClient } from "../../core/http/apiClient";
import { normalizeOperator } from "./types";
import type { Operator, OperatorApi } from "./types";

export const operatorsGateway = {
  getList: async (): Promise<Operator[]> => {
    const data = await httpClient.get<OperatorApi[]>("/operators");
    return Array.isArray(data) ? data.map(normalizeOperator) : [];
  },

  getOne: async (id: number): Promise<Operator> => {
    const data = await httpClient.get<OperatorApi>(`/operators/${id}`);
    return normalizeOperator(data);
  },

  create: async (data: Omit<OperatorApi, "id">): Promise<Operator> => {
    const created = await httpClient.post<OperatorApi>("/operators", data);
    return normalizeOperator(created);
  },

  update: async (id: number, data: Partial<OperatorApi>): Promise<Operator> => {
    const updated = await httpClient.put<OperatorApi>(`/operators/${id}`, data);
    return normalizeOperator(updated);
  },

  deactivate: async (id: number): Promise<Operator> => {
    const data = await httpClient.patch<OperatorApi>(
      `/operators/${id}/deactivate`,
      {},
    );
    return normalizeOperator(data);
  },

  deletePermanent: async (id: number): Promise<void> => {
    await httpClient.delete(`/operators/${id}`);
  },

  activate: async (id: number): Promise<Operator> => {
    const data = await httpClient.patch<OperatorApi>(
      `/operators/${id}/activate`,
      {},
    );
    return normalizeOperator(data);
  },

  delete: async (id: number): Promise<void> =>
    operatorsGateway.deactivate(id).then(() => undefined),
};
