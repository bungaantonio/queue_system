// src/core/config/config.ts
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

export const CONFIG = {
  API_BASE_URL: normalizedApiBaseUrl,

  get AUTH_URL() {
    return `${this.API_BASE_URL}/auth`;
  },

  get OPERATORS_URL() {
    return `${this.API_BASE_URL}/operators`;
  },

  get QUEUE_URL() {
    return `${this.API_BASE_URL}/queue`;
  },

  get AUDITS_URL() {
    return `${this.API_BASE_URL}/audits`;
  },

  get SSE_STREAM_URL() {
    return `${this.API_BASE_URL}/sse/stream`;
  },
};
