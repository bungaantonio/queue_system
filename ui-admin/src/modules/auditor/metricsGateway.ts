import { httpClient } from "../../core/http/apiClient";
import { ApiError } from "../../core/http/ApiError";
import type { AttendanceMetric } from "./metricsTypes";

export const metricsGateway = {
  getList: async (): Promise<AttendanceMetric[]> => {
    const metricsPath = "/metrics/dados";
    const rootPath = "/dados";

    const data = await getWith404Fallback<AttendanceMetric[]>(metricsPath, rootPath);
    return Array.isArray(data) ? data : [];
  },

  exportCsv: async (cenario?: string): Promise<void> => {
    const query = new URLSearchParams();
    const normalizedScenario = normalizeScenario(cenario);
    if (normalizedScenario) query.set("cenario", normalizedScenario);

    const suffix = query.toString();
    const metricsPath = suffix
      ? `/metrics/exportar-csv?${suffix}`
      : "/metrics/exportar-csv";
    const rootPath = suffix ? `/exportar-csv?${suffix}` : "/exportar-csv";

    const blob = await downloadWith404Fallback(metricsPath, rootPath);
    const csvText = await blob.text();
    const bomCsvBlob = new Blob(["\uFEFF", csvText], {
      type: "text/csv;charset=utf-8",
    });
    const sanitizedScenario = (normalizedScenario ?? "cenario")
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "");
    const ts = new Date().toISOString().replace(/[:.-]/g, "").slice(0, 15);
    const filename = `metrics_${sanitizedScenario || "cenario"}_${ts}.csv`;

    const objectUrl = URL.createObjectURL(bomCsvBlob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  },
};

const normalizeScenario = (value?: string) => {
  const normalized = String(value ?? "").trim();
  if (!normalized) return undefined;

  const lower = normalized.toLowerCase();
  if (lower === "todos" || lower === "all" || lower === "*") return undefined;

  return normalized;
};

const getWith404Fallback = async <T>(primary: string, fallback: string) => {
  try {
    return await httpClient.get<T>(primary);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return httpClient.get<T>(fallback);
    }
    throw error;
  }
};

const downloadWith404Fallback = async (primary: string, fallback: string) => {
  try {
    return await httpClient.download(primary);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return httpClient.download(fallback);
    }
    throw error;
  }
};
