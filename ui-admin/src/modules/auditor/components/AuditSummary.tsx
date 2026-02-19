// src/modules/auditor/components/AuditSummary.tsx
import {
  Box,
  Paper,
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

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  helper,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  helper?: string;
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.75,
      borderRadius: 2,
      border: "1px solid",
      borderColor: alpha(color, 0.22),
      background: `linear-gradient(135deg, #ffffff 0%, ${alpha(color, 0.07)} 100%)`,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        bgcolor: color,
      },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        sx={{
          p: 0.9,
          borderRadius: 1.5,
          bgcolor: alpha(color, 0.1),
          color,
          display: "grid",
          placeItems: "center",
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
          sx={{ fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Typography>
        {helper && (
          <Typography variant="caption" color="text.secondary">
            {helper}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
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

  const chainColor = summary.all_valid
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
      <Grid container spacing={1.5}>
        {[
          {
            title: "Total de Registos",
            value: summary.total_records,
            icon: Database,
            color: theme.palette.primary.main,
            helper: "Base analisada",
          },
          {
            title: "Válidos",
            value: summary.valid_records,
            icon: CheckCircle2,
            color: theme.palette.success.main,
            helper: "Sem inconsistência",
          },
          {
            title: "Inválidos",
            value: summary.invalid_records,
            icon: AlertTriangle,
            color: theme.palette.error.main,
            helper: "Exigem revisão",
          },
          {
            title: "Integridade",
            value: `${integrityPct}%`,
            icon: ShieldCheck,
            color: chainColor,
            helper: summary.all_valid
              ? "Cadeia consistente"
              : "Risco detectado",
          },
        ].map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Barra de saúde da cadeia */}
      <Paper
        elevation={0}
        sx={{
          p: 1.75,
          borderRadius: 2,
          border: "1px solid",
          borderColor: alpha(chainColor, 0.25),
          background: `linear-gradient(135deg, ${alpha(chainColor, 0.1)} 0%, ${alpha(theme.palette.background.paper, 0.96)} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            bgcolor: chainColor,
          },
        }}
      >
        <Stack spacing={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={0.5}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              Saúde da cadeia de auditoria
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 900, color: chainColor }}
            >
              {summary.all_valid ? "ESTÁVEL" : "ATENÇÃO IMEDIATA"}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={integrityPct}
            color={summary.all_valid ? "success" : "error"}
            sx={{ height: 6, borderRadius: 99 }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};
