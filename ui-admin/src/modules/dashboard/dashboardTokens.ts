// src/modules/dashboard/dashboardTokens.ts
import { alpha, Theme } from "@mui/material/styles";
import type { ChipProps } from "@mui/material";

export type DashboardTone = "flow" | "ready" | "watch" | "stable" | "rigor";

export const getToneColor = (theme: Theme, tone: DashboardTone) => {
  if (tone === "ready") return theme.palette.success.main;
  if (tone === "watch") return theme.palette.warning.main;
  if (tone === "rigor") return theme.palette.error.main;
  if (tone === "stable") return theme.palette.text.secondary;
  return theme.palette.primary.main;
};

export const getToneChipColor = (tone: DashboardTone): ChipProps["color"] => {
  if (tone === "ready") return "success";
  if (tone === "watch") return "warning";
  if (tone === "rigor") return "error";
  if (tone === "flow") return "primary";
  return "default";
};

export const getToneSurface = (theme: Theme, tone: DashboardTone) => {
  const color = getToneColor(theme, tone);
  return {
    color,
    bg: alpha(color, 0.04),
    border: alpha(color, 0.15),
    accent: alpha(color, 0.12),
  };
};

export const dashboardPanelSx = {
  p: { xs: 2, md: 2.5 },
  borderRadius: 3,
  border: "1px solid",
  borderColor: (theme: Theme) => alpha(theme.palette.divider, 0.8),
  background: (theme: Theme) =>
    `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
      theme.palette.background.default,
      0.4,
    )} 100%)`,
  backdropFilter: "blur(20px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.2),
    boxShadow: (theme: Theme) =>
      `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
  },
};
