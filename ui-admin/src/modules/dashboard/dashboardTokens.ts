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
    bg: alpha(color, 0.08),
    border: alpha(color, 0.22),
    accent: alpha(color, 0.14),
  };
};

export const dashboardPanelSx = {
  p: { xs: 1.5, md: 2 },
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.9) 100%)",
};
