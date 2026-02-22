import { httpClient } from "../../core/http/apiClient";
import { ApiError } from "../../core/http/ApiError";
import type { AttendanceMetric } from "./metricsTypes";

export const metricsGateway = {
  getList: async (params?: { cenario?: string }): Promise<AttendanceMetric[]> => {
    const query = new URLSearchParams();
    if (params?.cenario) query.set("cenario", params.cenario);

    const suffix = query.toString();
    const metricsPath = suffix ? `/metrics/dados?${suffix}` : "/metrics/dados";
    const rootPath = suffix ? `/dados?${suffix}` : "/dados";

    const data = await getWith404Fallback<AttendanceMetric[]>(
      metricsPath,
      rootPath,
    );
    return Array.isArray(data) ? data : [];
  },

  exportCsv: async (cenario?: string): Promise<void> => {
    const query = new URLSearchParams();
    if (cenario) query.set("cenario", cenario);

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
    const sanitizedScenario = (cenario ?? "cenario")
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
