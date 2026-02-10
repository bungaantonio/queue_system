// src/queue/queueDataProvider.ts
import { httpClient } from "../shared/http/fetchHttpClient";
import type { QueueUser } from "../modules/queue/types";

const API_URL = "/api/v1/queue";

export const queueDataProvider = {
  listWaitingAndCalled: async (): Promise<{
    data: QueueUser[];
    total: number;
  }> => {
    const data = await httpClient.get<QueueUser[]>(
      `${API_URL}/waiting-and-called`,
    );
    return { data, total: data.length };
  },

  getCurrent: async (): Promise<{ data: QueueUser | null }> => {
    const data = await httpClient.get<QueueUser | null>(`${API_URL}/current`);
    return { data };
  },

  callNext: async (): Promise<{ data: QueueUser | null }> => {
    const data = await httpClient.post<QueueUser | null>(
      `${API_URL}/call-next`,
    );
    return { data };
  },

  finish: async (): Promise<{ data: QueueUser | null }> => {
    const data = await httpClient.post<QueueUser | null>(`${API_URL}/finish`);
    return { data };
  },

  cancel: async (item_id: number): Promise<{ data: any }> => {
    const data = await httpClient.post(`${API_URL}/cancel`, { item_id });
    return { data };
  },

  requeue: async (
    user_id: number,
    attendance_type: string,
  ): Promise<{ data: any }> => {
    const data = await httpClient.post(`${API_URL}/requeue`, {
      user_id,
      attendance_type,
    });
    return { data };
  },

  skip: async (): Promise<{ data: any }> => {
    const data = await httpClient.post(`${API_URL}/skip`);
    return { data };
  },
};
