// src/modules/dashboard/components/StatCard.tsx
import { Card, Box, Typography, Stack, alpha } from "@mui/material";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}: StatCardProps) => (
  <Card
    elevation={0}
    sx={{ p: 3, height: "100%", position: "relative", overflow: "hidden" }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -10,
        right: -10,
        color: alpha(color, 0.05),
        transform: "rotate(-15deg)",
      }}
    >
      <Icon size={120} strokeWidth={1} />
    </Box>

    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(color, 0.1),
            color: color,
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
