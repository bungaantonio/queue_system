// src/modules/operators/operatorsGateway.ts
import { httpClient } from "../../core/http/apiClient";
import type { Operator } from "./types";

const BASE_URL = "/operators";

export const operatorsGateway = {
  getList: () => httpClient.get<Operator[]>(BASE_URL),
  getOne: (id: number) => httpClient.get<Operator>(`${BASE_URL}/${id}`),
  create: (op: Omit<Operator, "id">) => httpClient.post<Operator>(BASE_URL, op),
  update: (id: number, op: Partial<Operator>) =>
    httpClient.put<Operator>(`${BASE_URL}/${id}`, op),
  delete: (id: number) => httpClient.delete(`${BASE_URL}/${id}`),
};
