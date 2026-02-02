import { DataProvider } from "react-admin";
import { authProvider } from "../auth/authProvider";

const API_URL = "/operators/";

const getToken = () => localStorage.getItem("token") || "";

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = { status: res.status, body };

    try {
      await authProvider.checkError(error);
    } catch (err: any) {
      throw new Error(err.message || "Não autorizado");
    }

    throw new Error(body.detail || "Erro na operação");
  }

  return res.json();
};

const operatorDataProvider: DataProvider = {
  getList: async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await handleResponse(res);
    return { data, total: data.length };
  },

  getOne: async (_resource, { id }) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return { data: await handleResponse(res) };
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
    return { data: await handleResponse(res) };
  },

  update: async (_resource, { id, data }) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return { data: await handleResponse(res) };
  },

  delete: async (_resource, { id }) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return { data: await handleResponse(res) };
  },

  updateMany: async () =>
    Promise.reject(new Error("updateMany Não implementado")),
  getMany: async () => Promise.reject(new Error("getMany Não implementado")),
  getManyReference: async () =>
    Promise.reject(new Error("getManyReference Não implementado")),
  deleteMany: async () =>
    Promise.reject(new Error("deleteMany Não implementado")),
};

export default operatorDataProvider;
