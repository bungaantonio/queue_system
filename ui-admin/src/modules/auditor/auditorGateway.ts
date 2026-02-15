// src/modules/auditor/auditorGateway.ts
import { httpClient } from "../../core/http/apiClient";
import { CONFIG } from "../../core/config/config.ts";
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
      `${CONFIG.AUDITS_URL}${query}`,
    );
    return Array.isArray(res) ? res : [];
  },

  getSummary: async (): Promise<AuditChainSummary> => {
    return httpClient.get<AuditChainSummary>(
      `${CONFIG.AUDITS_URL}/verify-summary`,
    );
  },
  getOne: async (id: number): Promise<AuditVerificationDetail> => {
    const res = await httpClient.get<AuditVerificationDetail>(
      `${CONFIG.AUDITS_URL}/verify/${id}`,
    );
    return { ...res, id: res.ad };
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
