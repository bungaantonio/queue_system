import { httpClient } from "../../core/http/apiClient";
import type { Utentes } from "./types";

const BASE = "/users";
type UtenteCreatePayload = Record<string, unknown>;
type UtenteId = number | string;

export const utentesGateway = {
  getList: async (): Promise<Utentes[]> => httpClient.get<Utentes[]>(BASE),
  getOne: (id: UtenteId) => httpClient.get(`${BASE}/${id}`),
  create: (data: UtenteCreatePayload) =>
    httpClient.post("/queue/register", data), // Cadastro vai para a fila
};
