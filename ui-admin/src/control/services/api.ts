// src/control/services/api.ts
import { authProvider } from "../../operators/authProvider";

const getToken = () => localStorage.getItem("token") || "";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
    };

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const error = { status: res.status, body };
        await authProvider.checkError(error).catch(() => {
            throw new Error("Não autorizado");
        });
        throw new Error(body.detail || "Erro na operação");
    }

    return res.json();
};
