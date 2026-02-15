declare module "*.css";

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Adiciona aqui outras variáveis se necessário...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
