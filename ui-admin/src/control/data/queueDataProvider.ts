// src/control/data/queueDataProvider.ts
import { fetchWithAuth } from "../services/api";

const API_URL = "/api/v1/queue";

export const queueDataProvider = {
    listWaitingAndCalled: async () => {
        const data = await fetchWithAuth(`${API_URL}/waiting-and-called`);
        return { data, total: data.length };
    },

    getCurrent: async () => {
        const data = await fetchWithAuth(`${API_URL}/current`);
        return { data };
    },

    callNext: async () => {
        const data = await fetchWithAuth(`${API_URL}/call-next`, { method: "POST" });
        return { data };
    },

    finish: async () => {
        const data = await fetchWithAuth(`${API_URL}/finish`, { method: "POST" });
        return { data };
    },

    cancel: async (item_id: number) => {
        const data = await fetchWithAuth(`${API_URL}/cancel`, {
            method: "POST",
            body: JSON.stringify({ item_id }),
        });
        return { data };
    },

    requeue: async (user_id: number, attendance_type: string) => {
        const data = await fetchWithAuth(`${API_URL}/requeue`, {
            method: "POST",
            body: JSON.stringify({ user_id, attendance_type }),
        });
        return { data };
    },

    skip: async () => {
        const data = await fetchWithAuth(`${API_URL}/skip`, { method: "POST" });
        return { data };
    },
};
