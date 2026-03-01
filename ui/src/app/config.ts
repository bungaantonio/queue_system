// src/app/config.ts
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

export const CONFIG = {
  API_BASE_URL: normalizedApiBaseUrl,
  get SSE_STREAM_URL() {
    return `${this.API_BASE_URL}/sse/stream`;
  },
};
