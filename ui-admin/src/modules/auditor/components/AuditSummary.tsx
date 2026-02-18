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
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(color, 0.25),
      background: `linear-gradient(135deg, rgba(255,255,255,0.96) 0%, ${alpha(
        color,
        0.08,
      )} 100%)`,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "5px",
        bgcolor: color,
      },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          p: 0.9,
          borderRadius: 1.5,
          bgcolor: alpha(color, 0.12),
          color,
          boxShadow: `0 6px 14px ${alpha(color, 0.18)}`,
        }}
      >
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
          borderRadius: 2,
          border: "1px solid",
          borderColor: summary.all_valid
            ? (theme) => alpha(theme.palette.success.main, 0.25)
            : (theme) => alpha(theme.palette.error.main, 0.25),
          bgcolor: summary.all_valid
            ? (theme) => alpha(theme.palette.success.main, 0.06)
            : (theme) => alpha(theme.palette.error.main, 0.06),
          background: summary.all_valid
            ? (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.success.main,
                  0.16,
                )} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`
            : (theme) =>
                `linear-gradient(135deg, ${alpha(
                  theme.palette.error.main,
                  0.16,
                )} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            bgcolor: summary.all_valid ? "success.main" : "error.main",
          },
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
