import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    port: 3002,
    proxy: {
      "/auth": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/operators": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/api/v1/queue": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/api/v1/sse/stream": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));
