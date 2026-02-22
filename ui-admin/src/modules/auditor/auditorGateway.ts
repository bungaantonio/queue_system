// src/modules/auditor/auditorGateway.ts
import { httpClient } from "../../core/http/apiClient";
import type { AuditVerificationDetail, AuditChainSummary } from "./types";

export const auditorGateway = {
  getList: async (params?: {
    user_id?: number;
    operator_id?: number;
    action?: string;
    start?: string;
    end?: string;
    skip?: number;
    limit?: number;
  }): Promise<AuditVerificationDetail[]> => {
    const query = buildQuery(params);
    const res = await httpClient.get<AuditVerificationDetail[]>(
      `/audits${query}`,
    );
    return Array.isArray(res) ? res : [];
  },

  getSummary: async (): Promise<AuditChainSummary> => {
    return httpClient.get<AuditChainSummary>("/audits/verify-summary");
  },
  getOne: async (id: number): Promise<AuditVerificationDetail> => {
    const res = await httpClient.get<AuditVerificationDetail>(
      `/audits/verify/${id}`,
    );
    return { ...res, id: res.id };
  },

  investigate: async (
    id: number,
    note: string,
  ): Promise<AuditVerificationDetail> => {
    // Enviamos via query param conforme definido no seu router FastAPI
    return httpClient.patch<AuditVerificationDetail>(
      `/audits/${id}/investigate?note=${encodeURIComponent(note)}`,
    );
  },
};

function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const filtered: Record<string, any> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) filtered[k] = v;
  });
  const query = new URLSearchParams(filtered).toString();
  return query ? `?${query}` : "";
}
