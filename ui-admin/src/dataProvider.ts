// src/dataProvider.ts
import { DataProvider } from "react-admin";

const API_URL = "http://127.0.0.1:8000/operators";

const getToken = () => localStorage.getItem("token") || "";

const operatorDataProvider: DataProvider = {
    getList: async () => {
        const res = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Erro ao listar operadores");
        const data = await res.json();
        return { data, total: data.length };
    },

    getOne: async (_resource, { id }) => {
        const res = await fetch(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Operador não encontrado");
        const data = await res.json();
        return { data };
    },

    create: async (_resource, { data }) => {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erro ao criar operador");
        const responseData = await res.json();
        return { data: responseData };
    },

    // Atualizar operador
    update: async (_resource, { id, data }) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erro ao atualizar operador");
        const responseData = await res.json();
        return { data: responseData };
    },

    delete: async (_resource, { id }) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Erro ao deletar operador");
        const data = await res.json();
        return { data };
    },

    // Não implementados ainda
    updateMany: async () => { throw new Error("Não implementado"); },
    getMany: async () => { throw new Error("Não implementado"); },
    getManyReference: async () => { throw new Error("Não implementado"); },
    deleteMany: async () => { throw new Error("Não implementado"); },
};

export default operatorDataProvider;
