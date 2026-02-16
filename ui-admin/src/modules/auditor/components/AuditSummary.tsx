// src/modules/auditor/components/AuditSummary.tsx
import {
  Box,
  Card,
  Typography,
  Grid,
  Stack,
  alpha,
  LinearProgress,
  useTheme,
} from "@mui/material";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { AuditChainSummary } from "../types";

interface AuditStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  helper?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  helper,
}: AuditStatCardProps) => (
  <Card
    elevation={0}
    sx={{
      p: 1.5,
      borderRadius: 4,
      bgcolor: alpha(color, 0.04),
      borderColor: alpha(color, 0.12),
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box sx={{ p: 0.9, borderRadius: 2, bgcolor: alpha(color, 0.12), color }}>
        <Icon size={18} />
      </Box>
      <Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            display: "block",
            lineHeight: 1.1,
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
        {helper ? (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        ) : null}
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

  const integrityPct =
    summary.total_records > 0
      ? Math.round((summary.valid_records / summary.total_records) * 100)
      : 100;

  return (
    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Logs"
            value={summary.total_records}
            icon={Database}
            color={theme.palette.primary.main}
            helper="Base analisada"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Válidos"
            value={summary.valid_records}
            icon={CheckCircle2}
            color={theme.palette.success.main}
            helper="Sem inconsistência"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Inválidos"
            value={summary.invalid_records}
            icon={AlertTriangle}
            color={theme.palette.error.main}
            helper="Exigem revisão"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Integridade"
            value={`${integrityPct}%`}
            icon={ShieldCheck}
            color={
              summary.all_valid
                ? theme.palette.success.main
                : theme.palette.error.main
            }
            helper={
              summary.all_valid ? "Cadeia consistente" : "Risco detectado"
            }
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: 4,
          borderColor: summary.all_valid
            ? (theme) => alpha(theme.palette.success.main, 0.25)
            : (theme) => alpha(theme.palette.error.main, 0.25),
          bgcolor: summary.all_valid
            ? (theme) => alpha(theme.palette.success.main, 0.06)
            : (theme) => alpha(theme.palette.error.main, 0.06),
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={0.75}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              SAÚDE DA CADEIA DE AUDITORIA
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 900,
                color: summary.all_valid ? "success.dark" : "error.dark",
              }}
            >
              {summary.all_valid ? "ESTÁVEL" : "ATENÇÃO IMEDIATA"}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={integrityPct}
            color={summary.all_valid ? "success" : "error"}
            sx={{ height: 8, borderRadius: 99 }}
          />
        </Stack>
      </Card>
    </Stack>
  );
};
