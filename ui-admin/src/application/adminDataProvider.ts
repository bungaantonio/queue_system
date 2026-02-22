import type {
  DataProvider,
  GetListParams,
  GetListResult,
  QueryFunctionContext,
  RaRecord,
} from "react-admin";
import { operatorsGateway } from "../modules/operators/operatorsGateway";
import { utentesGateway } from "../modules/utentes/utentesGateway";
import { auditorGateway } from "../modules/auditor/auditorGateway";
import { metricsGateway } from "../modules/auditor/metricsGateway";
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
  "audit-metrics": metricsGateway,
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

const normalizeString = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const matchesQuery = (record: Record<string, unknown>, query: string) => {
  const normalizedQuery = normalizeString(query);
  if (!normalizedQuery) return true;

  return Object.values(record).some((value) => {
    if (
      value === null ||
      value === undefined ||
      typeof value === "object" ||
      typeof value === "function"
    ) {
      return false;
    }
    return normalizeString(value).includes(normalizedQuery);
  });
};

const applyFilters = (
  data: Record<string, unknown>[],
  filter: Record<string, unknown> | undefined,
) => {
  if (!filter) return data;

  const { q, ...rest } = filter;
  let filtered = data;

  if (typeof q === "string" && q.trim()) {
    filtered = filtered.filter((record) => matchesQuery(record, q));
  }

  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    filtered = filtered.filter((record) => {
      const recordValue = record[key];
      if (typeof value === "string") {
        if (recordValue === null || recordValue === undefined) return false;
        return normalizeString(recordValue).includes(normalizeString(value));
      }
      return recordValue === value;
    });
  });

  return filtered;
};

const applySorting = (
  data: Record<string, unknown>[],
  sort: { field: string; order: "ASC" | "DESC" } | undefined,
) => {
  if (!sort?.field) return data;
  const direction = sort.order === "DESC" ? -1 : 1;
  const field = sort.field;

  return [...data].sort((a, b) => {
    const left = a[field];
    const right = b[field];

    if (left === right) return 0;
    if (left === undefined || left === null) return 1 * direction;
    if (right === undefined || right === null) return -1 * direction;

    if (typeof left === "number" && typeof right === "number") {
      return (left - right) * direction;
    }

    return String(left).localeCompare(String(right), "pt-PT") * direction;
  });
};

const applyPagination = (
  data: Record<string, unknown>[],
  pagination: { page: number; perPage: number } | undefined,
) => {
  if (!pagination) return data;
  const { page, perPage } = pagination;
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
};

export const adminDataProvider: DataProvider = {
  getList: async <RecordType extends RaRecord = any>(
    resource: string,
    params: GetListParams & QueryFunctionContext,
  ): Promise<GetListResult<RecordType>> => {
    const gateway = getGateway(resource);
    if (!gateway?.getList) return { data: [] as RecordType[], total: 0 };

    const data = (await gateway.getList(params?.filter ?? {})) as Record<
      string,
      unknown
    >[];
    const filtered = applyFilters(data, params?.filter);
    const sorted = applySorting(filtered, params?.sort);
    const paginated = applyPagination(sorted, params?.pagination);

    return {
      data: paginated as RecordType[],
      total: filtered.length,
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
