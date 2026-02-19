// src/modules/auditor/components/AuditSummary.tsx
import {
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
} from "lucide-react";
import type { AuditChainSummary } from "../types";

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

  const chainOk = summary.all_valid;
  const chainColor = chainOk
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <Stack spacing={1.5} sx={{ mb: 2.5 }}>
      {/* Barra de saúde — primeiro, porque é o mais importante */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "2px solid",
          borderColor: alpha(chainColor, 0.4),
          background: `linear-gradient(135deg, ${alpha(chainColor, 0.08)} 0%, ${theme.palette.background.paper} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "5px",
            bgcolor: chainColor,
          },
        }}
      >
        <Stack spacing={1.25}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <ShieldCheck size={16} color={chainColor} strokeWidth={2.5} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Saúde da cadeia
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: "1.4rem",
                color: chainColor,
                letterSpacing: "-1px",
              }}
            >
              {integrityPct}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={integrityPct}
            color={chainOk ? "success" : "error"}
            sx={{ height: 6, borderRadius: 99 }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {chainOk
              ? "Todos os registos verificados com sucesso. Cadeia consistente."
              : `${summary.invalid_records} registo(s) comprometido(s). Verificação manual necessária.`}
          </Typography>
        </Stack>
      </Paper>

      {/* Métricas secundárias */}
      <Grid container spacing={1.5}>
        {[
          {
            icon: Database,
            label: "Total analisado",
            value: summary.total_records,
            color: theme.palette.text.secondary,
          },
          {
            icon: CheckCircle2,
            label: "Íntegros",
            value: summary.valid_records,
            color: theme.palette.success.main,
          },
          {
            icon: AlertTriangle,
            label: "Comprometidos",
            value: summary.invalid_records,
            color:
              summary.invalid_records > 0
                ? theme.palette.error.main
                : theme.palette.text.disabled,
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <Grid key={label} size={{ xs: 12, sm: 4 }}>
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha(color, 0.2),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "3px",
                  bgcolor: color,
                },
              }}
            >
              <Stack spacing={0.1} sx={{ pl: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    letterSpacing: "0.04em",
                  }}
                >
                  {label.toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 900,
                    fontSize: "1.5rem",
                    color,
                    lineHeight: 1,
                  }}
                >
                  {value}
                </Typography>
              </Stack>
              <Icon size={18} color={alpha(color, 0.4)} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
