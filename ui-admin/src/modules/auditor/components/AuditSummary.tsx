// src/modules/auditor/components/AuditSummary.tsx
import {
  Box,
  Card,
  Typography,
  Grid,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Fingerprint,
  Database,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { AuditChainSummary } from "../types";

interface AuditStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: AuditStatCardProps) => (
  <Card
    elevation={0}
    sx={{
      p: 1.5,
      bgcolor: alpha(color, 0.03),
      borderColor: alpha(color, 0.1),
      borderRadius: 4,
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(color, 0.1), color }}>
        <Icon size={20} />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            display: "block",
            mb: -0.5,
          }}
        >
          {title.toUpperCase()}
        </Typography>
        <Typography
          variant="h5"
          sx={{ fontWeight: 900, fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

export const AuditSummary = ({
  summary,
}: {
  summary: AuditChainSummary | null;
}) => {
  const theme = useTheme();
  if (!summary) return null;

  return (
    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Total Logs"
          value={summary.total_records}
          icon={Database}
          color={theme.palette.primary.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Válidos"
          value={summary.valid_records}
          icon={CheckCircle2}
          color={theme.palette.success.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <StatCard
          title="Inválidos"
          value={summary.invalid_records}
          icon={AlertTriangle}
          color={theme.palette.error.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <Card
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 4,
            bgcolor: summary.all_valid
              ? (theme) => alpha(theme.palette.success.main, 0.9)
              : (theme) => alpha(theme.palette.error.main, 0.9),
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center">
            <Fingerprint size={24} />
            <Typography variant="caption" sx={{ fontWeight: 900, mt: 0.5 }}>
              {summary.all_valid ? "CADEIA VERIFICADA" : "CADEIA CORROMPIDA"}
            </Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
};
