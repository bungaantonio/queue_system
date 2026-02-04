// src/operators/operatorsDataProvider.ts
import { httpClient } from "../shared/http/fetchHttpClient";
import type { Operator } from "../modules/operators/types";

const API_URL = "/operators";

export const operatorsDataProvider = {
  getList: async (): Promise<{ data: Operator[]; total: number }> => {
    const data = await httpClient.get<Operator[]>(API_URL);
    return { data, total: data.length };
  },

  getOne: async (id: number): Promise<{ data: Operator }> => {
    const data = await httpClient.get<Operator>(`${API_URL}/${id}`);
    return { data };
  },

  create: async (
    operator: Omit<Operator, "id">,
  ): Promise<{ data: Operator }> => {
    const data = await httpClient.post<Operator>(API_URL, operator);
    return { data };
  },

  update: async (
    id: number,
    operator: Partial<Operator>,
  ): Promise<{ data: Operator }> => {
    const data = await httpClient.put<Operator>(`${API_URL}/${id}`, operator);
    return { data };
  },

  delete: async (id: number): Promise<{ data: any }> => {
    const data = await httpClient.delete(`${API_URL}/${id}`);
    return { data };
  },

  getMany: async (ids: number[]): Promise<{ data: Operator[] }> => {
    const data = await Promise.all(
      ids.map((id) => httpClient.get<Operator>(`${API_URL}/${id}`)),
    );
    return { data };
  },

  getManyReference: async (): Promise<{ data: Operator[]; total: number }> => ({
    data: [],
    total: 0,
  }),
  updateMany: async (): Promise<{ data: number[] }> => ({ data: [] }),
  deleteMany: async (): Promise<{ data: number[] }> => ({ data: [] }),
};
