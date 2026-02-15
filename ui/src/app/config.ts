// src/app/config.ts
export const CONFIG = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  get SSE_STREAM_URL() {
    return `${this.API_BASE_URL}/sse/stream`;
  },
};
