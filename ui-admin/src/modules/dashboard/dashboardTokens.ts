// src/modules/dashboard/dashboardTokens.ts
import { alpha, Theme } from "@mui/material/styles";
import type { ChipProps } from "@mui/material";

export type DashboardTone = "flow" | "ready" | "watch" | "stable" | "rigor";

export const getToneColor = (theme: Theme, tone: DashboardTone): string => {
  if (tone === "ready")  return theme.palette.success.main;
  if (tone === "watch")  return theme.palette.warning.main;
  if (tone === "rigor")  return theme.palette.error.main;
  if (tone === "stable") return theme.palette.text.secondary;
  return theme.palette.primary.main;
};

export const getToneChipColor = (tone: DashboardTone): ChipProps["color"] => {
  if (tone === "ready")  return "success";
  if (tone === "watch")  return "warning";
  if (tone === "rigor")  return "error";
  if (tone === "flow")   return "primary";
  return "default";
};

export const getToneSurface = (theme: Theme, tone: DashboardTone) => {
  const color = getToneColor(theme, tone);
  return {
    color,
    bg:     alpha(color, 0.06),
    border: alpha(color, 0.2),
    accent: alpha(color, 0.12),
  };
};

// Painel base — usado em Paper do Dashboard
export const dashboardPanelSx = {
  p: { xs: 1.5, md: 2.5 },
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "divider",
  background: "#ffffff",
  boxShadow: "none",
} as const;

// Variante com fundo subtil para secções de destaque
export const dashboardAccentPanelSx = {
  ...dashboardPanelSx,
  background:
    "linear-gradient(135deg, rgba(67,56,202,0.04) 0%, rgba(255,255,255,1) 60%)",
} as const;