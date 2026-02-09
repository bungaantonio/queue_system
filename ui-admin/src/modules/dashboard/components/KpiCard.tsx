// components/kpis/KpiCard.tsx
import { Card, CardContent, Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "primary" | "success" | "warning" | "error";
}

export const KpiCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "primary",
}: KpiCardProps) => (
  <Card
    sx={{
      height: "100%",
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {icon && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: `${color}.50`,
            color: `${color}.main`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 48,
            minHeight: 48,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);
