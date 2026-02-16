import type { DataProvider } from "react-admin";
import { operatorsGateway } from "../modules/operators/operatorsGateway";
import { utentesGateway } from "../modules/utentes/utentesGateway";
import { auditorGateway } from "../modules/auditor/auditorGateway";
import { ApiError } from "../core/http/ApiError";

interface ResourceGateway {
  getList?: (...args: any[]) => Promise<any[]>;
  getOne?: (id: any) => Promise<any>;
  create?: (data: any) => Promise<any>;
  update?: (id: any, data: any) => Promise<any>;
  delete?: (id: any) => Promise<void>;
}

const resourceMap: Record<string, ResourceGateway> = {
  operators: operatorsGateway,
  utentes: utentesGateway,
  audits: auditorGateway,
};

const uiOnlyResources = new Set(["atendimento"]);

const getGateway = (resource: string): ResourceGateway | null => {
  const gateway = resourceMap[resource];
  if (gateway) return gateway;

  if (!uiOnlyResources.has(resource)) {
    throw new ApiError(404, { detail: `Recurso '${resource}' não suportado` });
  }

  return null;
};

export const adminDataProvider: DataProvider = {
  getList: async (resource) => {
    const gateway = getGateway(resource);
    if (!gateway?.getList) return { data: [], total: 0 };

    const data = await gateway.getList();

    return {
      data,
      total: data.length,
    };
  },

  getOne: async (resource, { id }) => {
    const gateway = getGateway(resource);
    if (!gateway?.getOne) return { data: {} };
    const data = await gateway.getOne(id);

    return { data };
  },

  create: async (resource, { data }) => {
    const gateway = getGateway(resource);
    if (!gateway?.create) return { data: {} };
    const created = await gateway.create(data);

    return { data: created };
  },

  update: async (resource, { id, data }) => {
    const gateway = getGateway(resource);
    if (!gateway?.update) return { data: {} };
    const updated = await gateway.update(id, data);

    return { data: updated };
  },

  delete: async (resource, { id }) => {
    const gateway = getGateway(resource);
    if (!gateway?.delete) return { data: {} };
    await gateway.delete(id);

    return { data: { id } as any };
  },

  getMany: async (resource, { ids }) => {
    const gateway = getGateway(resource);
    if (!gateway?.getOne) return { data: [] };
    const getOne = gateway.getOne;
    const data = await Promise.all(ids.map((id) => getOne(id)));

    return { data };
  },

  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async (resource, { ids }) => {
    const gateway = getGateway(resource);
    if (!gateway?.delete) return { data: ids };
    const deleteOne = gateway.delete;
    await Promise.all(ids.map((id) => deleteOne(id)));

    return { data: ids };
  },
};
