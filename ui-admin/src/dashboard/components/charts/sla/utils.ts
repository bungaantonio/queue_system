import { SLAMetric, SLAStatus } from "./types";

// Retorna string MUI compatível para cor do texto
export const getStatusColor = (status: SLAStatus): string => {
  switch (status) {
    case "success":
      return "success.main";
    case "warning":
      return "warning.main";
    case "error":
      return "error.main";
    default:
      return "text.primary";
  }
};

// Retorna string MUI compatível para cor de fundo
export const getStatusBg = (status: SLAStatus): string => {
  switch (status) {
    case "success":
      return "success.50";
    case "warning":
      return "warning.50";
    case "error":
      return "error.50";
    default:
      return "grey.50";
  }
};

// Calcula média global do SLA
export const calculateOverallSLA = (metrics: SLAMetric[]): number => {
  const total = metrics.reduce((acc, m) => acc + m.current, 0);
  return parseFloat((total / metrics.length).toFixed(1));
};

// Determina status global baseado no valor e target
export const getOverallSLAStatus = (
  overall: number,
  target: number,
): SLAStatus => {
  if (overall >= target) return "success";
  if (overall >= target - 5) return "warning";
  return "error";
};
