import { httpClient } from "../../core/http/apiClient";
import type { AuditVerificationDetail, AuditChainSummary } from "./types";

const BASE = "/audit";

export const auditorGateway = {
  getAudits: async (params?: {
    user_id?: number;
    action?: string;
    start?: string;
    end?: string;
    skip?: number;
    limit?: number;
  }): Promise<AuditVerificationDetail[]> => {
    const query = buildQuery(params);
    const res = await httpClient.get<AuditVerificationDetail[]>(
      `${BASE}${query}`,
    );
    return Array.isArray(res) ? res : [];
  },

  getSummary: async (): Promise<AuditChainSummary> => {
    const res = await httpClient.get<AuditChainSummary>(
      `${BASE}/verify-summary`,
    );
    return res;
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
