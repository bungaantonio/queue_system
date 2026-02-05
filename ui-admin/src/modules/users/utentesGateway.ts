import { httpClient } from "../../core/http/apiClient";
import type { Utentes } from "./types";

const BASE = "/users";
export const utentesGateway = {
  getList: async (): Promise<Utentes[]> => httpClient.get<Utentes[]>(BASE),
  getOne: (id: any) => httpClient.get(`${BASE}/${id}`),
  create: (data: any) => httpClient.post("/queue/register", data), // Cadastro vai para a fila
};
