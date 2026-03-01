declare module "*.css";

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly UI_VITE_API_BASE_URL: string;
  // Adiciona aqui outras variáveis se necessário...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
