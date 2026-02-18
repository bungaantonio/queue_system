import { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Paper,
  Chip,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import type { ChipProps } from "@mui/material";
import { Title, useGetList } from "react-admin";
import { Link } from "react-router-dom";
import {
  Users,
  Clock3,
  BellRing,
  ShieldCheck,
  ShieldAlert,
  UserCog,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { StatCard } from "./components/StatCard";
import { AtendimentoContext } from "../queue/components/AtendimentoProvider";
import { useGetHeader } from "../auditor/hooks/useAuditSummary";
import type { Operator } from "../operators/types";
import { PageContainer } from "../shared/components/PageContainer";
import {
  DashboardTone,
  dashboardPanelSx,
  getToneChipColor,
  getToneSurface,
} from "./dashboardTokens";

export const DashboardPage = () => {
  const atendimento = useContext(AtendimentoContext);
  const { summary } = useGetHeader();
  const { data: operators = [] } = useGetList<Operator>("operators");

  const queue = atendimento?.queue ?? [];
  const called = atendimento?.called ?? null;
  const current = atendimento?.current ?? null;

  const theme = useTheme();
  const activeOperators = useMemo(
    () => operators.filter((op) => op.active).length,
    [operators],
  );
  const attendantsOnline = useMemo(
    () => operators.filter((op) => op.active && op.role === "attendant").length,
    [operators],
  );

  const hasActiveCall = Boolean(called || current);
  const hasAlerts = summary ? !summary.all_valid : false;
  const queueTone: DashboardTone = queue.length > 5 ? "watch" : "ready";
  const integrityTone: DashboardTone = hasAlerts ? "rigor" : "ready";

  return (
    <PageContainer>
      <Title title="Dashboard de Controle" />

      <Stack spacing={3}>
        <Box sx={{ mb: 1 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
            sx={{
              pb: 3,
              borderBottom: (theme) =>
                `2px solid ${alpha(theme.palette.divider, 0.6)}`,
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(
                    theme.palette.primary.main,
                    0.8,
                  )} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Centro de Comando
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                Priorize ações por estado: fluxo, vigilância e integridade.
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ width: { xs: "100%", lg: "auto" } }}
            >
              <Chip
                icon={<UserCog size={12} />}
                label={`${attendantsOnline} ATENDENTES ONLINE`}
                sx={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                  color: "success.dark",
                  border: "1px solid",
                  borderColor: (theme) =>
                    alpha(theme.palette.success.main, 0.28),
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.18),
                    transform: "scale(1.02)",
                  },
                }}
              />
              <Button
                component={Link}
                to="/atendimento"
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  px: 3,
                  py: 1.25,
                  boxShadow: (theme) =>
                    `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: (theme) =>
                      `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                  },
                }}
              >
                Abrir Atendimento
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Grid container spacing={2.5}>
          {[
            {
              title: "Fila em Espera",
              value: queue.length,
              icon: Clock3,
              tone: queueTone,
            },
            {
              title: "Chamada Ativa",
              value: hasActiveCall ? "SIM" : "NÃO",
              icon: BellRing,
              tone: (hasActiveCall ? "flow" : "stable") as DashboardTone,
            },
            {
              title: "Operadores Ativos",
              value: `${activeOperators}/${operators.length}`,
              icon: Users,
              tone: "ready" as DashboardTone,
            },
            {
              title: "Integridade",
              value: hasAlerts ? "ALERTA" : "OK",
              icon: hasAlerts ? ShieldAlert : ShieldCheck,
              tone: integrityTone,
            },
          ].map((stat) => (
            <Grid size={{ xs: 12, sm: 6, xl: 3 }} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper sx={dashboardPanelSx}>
              <Stack spacing={0.75} sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    fontSize: "0.7rem",
                  }}
                >
                  PRIORIDADES OPERACIONAIS
                </Typography>
                <Box
                  sx={{
                    height: 2,
                    width: 40,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
              </Stack>
              <Stack spacing={1.5}>
                <PriorityRow
                  state={queue.length > 5 ? "watch" : "ready"}
                  label="Gestão de fila"
                  detail={
                    queue.length > 5
                      ? `Fila com ${queue.length} utentes. Reforçar guichês.`
                      : "Fila sob controle operacional."
                  }
                />
                <PriorityRow
                  state={hasActiveCall ? "flow" : "stable"}
                  label="Chamada no display"
                  detail={
                    called
                      ? `Aguardando confirmação de ${called.name}.`
                      : current
                        ? `Em atendimento: ${current.name}.`
                        : "Sem chamada pendente no momento."
                  }
                />
                <PriorityRow
                  state={hasAlerts ? "rigor" : "ready"}
                  label="Integridade de auditoria"
                  detail={
                    hasAlerts
                      ? `${summary?.invalid_records ?? 0} registro(s) inconsistentes.`
                      : "Cadeia de auditoria consistente."
                  }
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper sx={dashboardPanelSx}>
              <Stack spacing={0.75} sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 800,
                    letterSpacing: 1.2,
                    fontSize: "0.7rem",
                  }}
                >
                  PAINEL DE RISCO
                </Typography>
                <Box
                  sx={{
                    height: 2,
                    width: 40,
                    bgcolor: "error.main",
                    borderRadius: 1,
                  }}
                />
              </Stack>
              <Stack spacing={1.5}>
                <RiskTag
                  icon={AlertTriangle}
                  label="Espera prolongada"
                  value={
                    queue.length > 8
                      ? "Alto"
                      : queue.length > 4
                        ? "Médio"
                        : "Baixo"
                  }
                  tone={
                    queue.length > 8
                      ? "watch"
                      : queue.length > 4
                        ? "flow"
                        : "ready"
                  }
                />
                <RiskTag
                  icon={ShieldCheck}
                  label="Integridade"
                  value={hasAlerts ? "Revisão necessária" : "Verificada"}
                  tone={hasAlerts ? "rigor" : "ready"}
                />
                <RiskTag
                  icon={CheckCircle2}
                  label="Capacidade de atendimento"
                  value={attendantsOnline > 0 ? "Operacional" : "Crítico"}
                  tone={attendantsOnline > 0 ? "ready" : "rigor"}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </PageContainer>
  );
};

const PriorityRow = ({
  state,
  label,
  detail,
}: {
  state: DashboardTone;
  label: string;
  detail: string;
}) => {
  const tone: ChipProps["color"] = getToneChipColor(state);
  const theme = useTheme();
  const toneSurface = getToneSurface(theme, state);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: toneSurface.border,
        bgcolor: toneSurface.bg,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          bgcolor: toneSurface.color,
          transition: "width 0.3s ease",
        },
        "&:hover": {
          borderColor: toneSurface.color,
          bgcolor: alpha(toneSurface.color, 0.08),
          transform: "translateX(4px)",
          "&::before": {
            width: "5px",
          },
        },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {label}
      </Typography>
      <Chip
        size="small"
        color={tone}
        label={detail}
        sx={{
          width: { xs: "100%", md: "auto" },
          fontWeight: 600,
          "& .MuiChip-label": {
            whiteSpace: "normal",
            lineHeight: 1.4,
            py: 0.5,
            fontSize: "0.7rem",
          },
        }}
      />
    </Stack>
  );
};

const RiskTag = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: DashboardTone;
}) => {
  const theme = useTheme();
  const toneSurface = getToneSurface(theme, tone);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={1}
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: toneSurface.border,
        bgcolor: toneSurface.bg,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: toneSurface.color,
          bgcolor: alpha(toneSurface.color, 0.08),
          transform: "scale(1.02)",
          "& .risk-icon": {
            transform: "rotate(10deg) scale(1.1)",
          },
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          className="risk-icon"
          sx={{
            color: toneSurface.color,
            display: "flex",
            transition: "transform 0.3s ease",
          }}
        >
          <Icon size={18} strokeWidth={2.5} />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Stack>
      <Typography
        variant="caption"
        sx={{
          color: toneSurface.color,
          fontWeight: 800,
          letterSpacing: 0.5,
          bgcolor: alpha(toneSurface.color, 0.15),
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          alignSelf: { xs: "flex-start", sm: "auto" },
        }}
      >
        {value.toUpperCase()}
      </Typography>
    </Stack>
  );
};
