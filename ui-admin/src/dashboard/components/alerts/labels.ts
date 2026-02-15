import { AlertPriority, AlertType } from "./alertTypes";

export const ALERT_PRIORITY_LABELS: Record<AlertPriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  warning: "Aviso",
  error: "Erro",
  success: "Sucesso",
  info: "Informação",
};
