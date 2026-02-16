import { httpClient } from "../../core/http/apiClient";
import { normalizeUtente } from "./utentes.types";
import type {
  Utente,
  UtenteApiListItem,
  UtenteCreatePayload,
} from "./utentes.types";

export const utentesGateway = {
  getList: async (): Promise<Utente[]> => {
    const data = await httpClient.get<UtenteApiListItem[]>("/users");
    return Array.isArray(data) ? data.map(normalizeUtente) : [];
  },
  getOne: async (id: number | string): Promise<Utente> => {
    const data = await httpClient.get<UtenteApiListItem>(`/users/${id}`);
    return normalizeUtente(data);
  },
  update: async (
    id: number | string,
    data: Partial<Utente>,
  ): Promise<Utente> => {
    const payload = {
      ...data,
      document_id: data.document_id ?? data.id_number,
    };
    const updated = await httpClient.put<UtenteApiListItem>(
      `/users/${id}`,
      payload,
    );
    return normalizeUtente(updated);
  },
  create: (payload: UtenteCreatePayload) =>
    httpClient.post("/queue/register", payload),
};
