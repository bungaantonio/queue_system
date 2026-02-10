// src/dashboard/components/charts/sla/labels.ts
import { SLAStatus } from "./types";

// Labels em português europeu para o utilizador
export const SLA_STATUS_LABELS: Record<SLAStatus, string> = {
    success: "Sucesso",
    warning: "Alerta",
    error: "Erro",
};

// Chaves de cor do MUI palette
export const SLA_STATUS_COLORS: Record<SLAStatus, "success" | "warning" | "error"> = {
    success: "success",
    warning: "warning",
    error: "error",
};
