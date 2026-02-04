import type { DataProvider } from "react-admin";
import { operatorsGateway } from "../modules/operators/operatorsGateway";
import { atendimentoGateway } from "../modules/queue/atendimentoGateway";
import { usersGateway } from "../modules/users/usersGateway";

const resourceMap: Record<string, any> = {
  operators: operatorsGateway,
  utentes: usersGateway,
  atendimento: atendimentoGateway,
};

export const adminDataProvider: DataProvider = {
  getList: async (resource) => {
    const gateway = resourceMap[resource];
    const data = await gateway.getList();

    return {
      data,
      total: data.length,
    };
  },

  getOne: async (resource, { id }) => {
    const gateway = resourceMap[resource];
    const data = await gateway.getOne(id);

    return { data };
  },

  create: async (resource, { data }) => {
    const gateway = resourceMap[resource];
    const created = await gateway.create(data);

    return { data: created };
  },

  update: async (resource, { id, data }) => {
    const gateway = resourceMap[resource];
    const updated = await gateway.update(id, data);

    return { data: updated };
  },

  delete: async (resource, { id }) => {
    const gateway = resourceMap[resource];
    await gateway.delete(id);

    return { data: { id } as any };
  },

  getMany: async (resource, { ids }) => {
    const gateway = resourceMap[resource];
    const data = await Promise.all(ids.map((id) => gateway.getOne(id)));

    return { data };
  },

  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async (resource, { ids }) => {
    const gateway = resourceMap[resource];
    await Promise.all(ids.map((id) => gateway.delete(id)));

    return { data: ids };
  },
};
