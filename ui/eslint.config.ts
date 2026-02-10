import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignorar diretórios de build/output
  globalIgnores(["dist", "node_modules"]),

  // Config geral para JS/TS + React
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    extends: [
      js.configs.recommended, // Regras JS básicas
      "plugin:@typescript-eslint/recommended", // Regras TS
      reactHooks.configs["recommended-latest"], // Hooks React
      reactRefresh.configs.vite, // Vite + React Fast Refresh
    ],
    parser: "@typescript-eslint/parser", // Parser TS
    plugins: ["@typescript-eslint"],
    rules: {
      "no-unused-vars": "off", // Desativa JS padrão
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ], // Usa regra TS
      "react/prop-types": "off", // TS cuida de tipos
    },
  },
]);
