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
        p: 2.5,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: toneSurface.border,
        background: `linear-gradient(135deg, ${alpha(
          toneSurface.color,
          0.03
        )} 0%, ${theme.palette.background.paper} 100%)`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: toneSurface.color,
          boxShadow: `0 12px 40px -8px ${alpha(toneSurface.color, 0.25)}`,
          "& .stat-icon": {
            transform: "scale(1.08) rotate(-5deg)",
          },
          "& .stat-bg-icon": {
            transform: "rotate(-10deg) scale(1.1)",
            opacity: 0.08,
          },
        },
      }}
    >
      <Box
        className="stat-bg-icon"
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          color: toneSurface.color,
          opacity: 0.04,
          transform: "rotate(-15deg)",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Icon size={120} strokeWidth={1.5} />
      </Box>

      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box
            className="stat-icon"
            sx={{
              p: 1.25,
              borderRadius: 2.5,
              bgcolor: toneSurface.accent,
              color: toneSurface.color,
              display: "flex",
              boxShadow: `0 4px 12px ${alpha(toneSurface.color, 0.15)}`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Icon size={22} strokeWidth={2.5} />
          </Box>
          {trend && (
            <Typography
              variant="caption"
              sx={{
                color: "success.main",
                fontWeight: 700,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              {trend}
            </Typography>
          )}
        </Stack>

        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontVariantNumeric: "tabular-nums",
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              lineHeight: 1,
              wordBreak: "break-word",
              background: `linear-gradient(135deg, ${toneSurface.color} 0%, ${alpha(
                toneSurface.color,
                0.7
              )} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
