// src/dashboard/data/queueDataProvider.ts
import { fetchWithAuth } from "../services/api";

const API_URL = "http://127.0.0.1:8000/api/v1/queue";

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

    cancel: async (user_id: number) => {
        const data = await fetchWithAuth(`${API_URL}/cancel`, {
            method: "POST",
            body: JSON.stringify({ user_id }),
        });
        return { data };
    },

    requeue: async (user_id: number, attendance_type: string, operator_id: number) => {
        const data = await fetchWithAuth(`${API_URL}/requeue`, {
            method: "POST",
            body: JSON.stringify({ user_id, attendance_type, operator_id }),
        });
        return { data };
    },

    skip: async () => {
        const data = await fetchWithAuth(`${API_URL}/skip`, { method: "POST" });
        return { data };
    },
};
