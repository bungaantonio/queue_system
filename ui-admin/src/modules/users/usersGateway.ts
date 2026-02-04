import { httpClient } from "../../core/http/apiClient";

const BASE = "/users";
export const usersGateway = {
  getList: () => httpClient.get(BASE),
  getOne: (id: any) => httpClient.get(`${BASE}/${id}`),
  create: (data: any) => httpClient.post("/queue/register", data), // Cadastro vai para a fila
};
