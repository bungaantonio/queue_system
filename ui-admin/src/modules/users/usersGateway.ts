import { httpClient } from "../../core/http/apiClient";
import type { Users } from "./types";

const API_URL = "/api/v1/users";

export const usersGateway = {
  getList: async (): Promise<Users[]> => httpClient.get<Users[]>(API_URL),
  getOne: async (id: number): Promise<Users> =>
    httpClient.get<Users>(`${API_URL}/${id}`),
  create: async (user: Omit<Users, "id">): Promise<Users> =>
    httpClient.post<Users>(API_URL, user),
  update: async (id: number, user: Partial<Users>): Promise<Users> =>
    httpClient.put<Users>(`${API_URL}/${id}`, user),
  delete: async (id: number): Promise<void> =>
    httpClient.delete(`${API_URL}/${id}`),
};
