// src/modules/dashboard/components/StatCard.tsx
import { Card, Box, Typography, Stack, alpha, useTheme } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import { DashboardTone, getToneSurface } from "../dashboardTokens";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: DashboardTone;
  trend?: string;
}

export const StatCard = ({ title, value, icon: Icon, tone, trend }: StatCardProps) => {
  const theme = useTheme();
  const s = getToneSurface(theme, tone);

  return (
    <Card
      elevation={0}
      sx={{
        p: "20px 24px",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: "12px",
        border: "1px solid",
        borderColor: s.border,
        background: `linear-gradient(150deg, ${alpha(s.color, 0.06)} 0%, #ffffff 55%)`,
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: `0 8px 24px ${alpha(s.color, 0.14)}`,
          borderColor: alpha(s.color, 0.35),
        },
      }}
    >
      {/* Ícone fantasma decorativo */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -8,
          right: -8,
          color: alpha(s.color, 0.06),
          pointerEvents: "none",
        }}
      >
        <Icon size={88} strokeWidth={1} />
      </Box>

      <Stack spacing={2}>
        {/* Linha de título + ícone */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "9px",
              bgcolor: s.accent,
              color: s.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} strokeWidth={2} />
          </Box>

          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 700,
              letterSpacing: "0.06em",
              fontSize: "0.6875rem",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Valor */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography
            component="span"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              fontSize: { xs: "1.875rem", md: "2.25rem" },
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "text.primary",
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              sx={{ color: "success.dark", fontWeight: 700 }}
            >
              {trend}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
};