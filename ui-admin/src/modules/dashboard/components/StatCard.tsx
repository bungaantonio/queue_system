// src/modules/dashboard/components/StatCard.tsx
import { Card, Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: "flow" | "ready" | "watch" | "stable";
  trend?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  tone,
  trend,
}: StatCardProps) => {
  const theme = useTheme();
  const toneColor =
    tone === "ready"
      ? theme.palette.success.main
      : tone === "watch"
        ? theme.palette.warning.main
        : tone === "stable"
          ? theme.palette.text.secondary
          : theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.25,
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          color: alpha(toneColor, 0.05),
          transform: "rotate(-15deg)",
        }}
      >
        <Icon size={92} strokeWidth={1} />
      </Box>

      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: alpha(toneColor, 0.1),
              color: toneColor,
              display: "flex",
            }}
          >
            <Icon size={20} />
          </Box>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", fontWeight: 800, letterSpacing: 1 }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 900, fontVariantNumeric: "tabular-nums" }}
          >
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{ color: "success.main", fontWeight: 800 }}
            >
              {trend}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
};
