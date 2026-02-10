// eslint.config.mjs
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig({
  ignores: ["**/node_modules", "**/dist"],
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    react: require("eslint-plugin-react"),
    "react-hooks": require("eslint-plugin-react-hooks"),
    prettier: require("eslint-plugin-prettier"),
  },
  rules: {
    // TypeScript
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off",

    // React
    "react/react-in-jsx-scope": "off",

    // Prettier
    "prettier/prettier": "error",
  },
  settings: {
    react: { version: "detect" },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
    {
      files: ["**/*.js", "**/*.jsx"],
      extends: ["eslint:recommended", "plugin:react/recommended"],
    },
    {
      files: ["**/*.{ts,tsx,js,jsx}"],
      extends: ["plugin:prettier/recommended"],
    },
  ],
});
