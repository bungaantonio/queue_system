// src/modules/dashboard/components/StatCard.tsx
import { Card, Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import { LucideIcon } from "lucide-react";
import { DashboardTone, getToneSurface } from "../dashboardTokens";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: DashboardTone;
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
  const toneSurface = getToneSurface(theme, tone);

  return (
    <Card
      elevation={0}
      sx={{
        p: 2.25,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: toneSurface.border,
        background: `linear-gradient(160deg, ${alpha(
          toneSurface.color,
          0.07,
        )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 52%)`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -10,
          right: -10,
          color: alpha(toneSurface.color, 0.05),
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
              bgcolor: toneSurface.accent,
              color: toneSurface.color,
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
            sx={{
              fontWeight: 900,
              fontVariantNumeric: "tabular-nums",
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1,
              wordBreak: "break-word",
            }}
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
