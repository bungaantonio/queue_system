import { httpClient } from "../../core/http/apiClient";
import type { Utente, UtenteCreatePayload } from "./utentes.types";

export const utentesGateway = {
  getList: () => httpClient.get<Utente[]>("/users"),
  getOne: (id: number | string) => httpClient.get<Utente>(`/users/${id}`),
  create: (payload: UtenteCreatePayload) =>
    httpClient.post("/queue/register", payload),
};
