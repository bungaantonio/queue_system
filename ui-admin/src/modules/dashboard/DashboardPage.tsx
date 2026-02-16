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

export const DashboardPage = () => {
  const atendimento = useContext(AtendimentoContext);
  const { summary } = useGetHeader();
  const { data: operators = [] } = useGetList<Operator>("operators");

  const queue = atendimento?.queue ?? [];
  const called = atendimento?.called ?? null;
  const current = atendimento?.current ?? null;

  const activeOperators = useMemo(
    () => operators.filter((op) => op.active).length,
    [operators],
  );
  const attendantsOnline = useMemo(
    () => operators.filter((op) => op.active && op.role === "attendant").length,
    [operators],
  );

  const queueTone: "watch" | "ready" = queue.length > 5 ? "watch" : "ready";
  const integrityTone: "ready" | "rigor" =
    summary && !summary.all_valid ? "rigor" : "ready";

  return (
    <Box>
      <Title title="Dashboard de Controle" />

      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          gap={1.25}
        >
          <Box>
            <Typography variant="h4">Centro de Comando</Typography>
            <Typography variant="body2" color="text.secondary">
              Priorize ações por estado: fluxo, vigilância e integridade.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              icon={<UserCog size={12} />}
              label={`${attendantsOnline} ATENDENTES ONLINE`}
              sx={{
                fontSize: "0.62rem",
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                color: "success.dark",
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.success.main, 0.28),
              }}
            />
            <Button
              component={Link}
              to="/atendimento"
              variant="contained"
              endIcon={<ArrowRight size={16} />}
            >
              Abrir Atendimento
            </Button>
          </Stack>
        </Stack>

        {(called || current) && (
          <Paper
            sx={{
              p: 1.5,
              borderRadius: 4,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.26),
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <BellRing size={16} color="#4f46e5" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  CHAMADA EM CURSO
                </Typography>
                <Chip
                  size="small"
                  label={called ? "AGUARDANDO CONFIRMAÇÃO" : "EM ATENDIMENTO"}
                  sx={{
                    height: 20,
                    fontSize: "0.6rem",
                    bgcolor: called
                      ? (theme) => alpha(theme.palette.warning.main, 0.14)
                      : (theme) => alpha(theme.palette.success.main, 0.14),
                    color: called ? "warning.dark" : "success.dark",
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {called?.name || current?.name}{" "}
                <strong>{called?.position || current?.position}</strong>
              </Typography>
            </Stack>
          </Paper>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard
              title="Fila em Espera"
              value={queue.length}
              icon={Clock3}
              tone={queueTone}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard
              title="Chamada Ativa"
              value={called || current ? "SIM" : "NÃO"}
              icon={BellRing}
              tone={called || current ? "flow" : "stable"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard
              title="Operadores Ativos"
              value={`${activeOperators}/${operators.length}`}
              icon={Users}
              tone="ready"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard
              title="Integridade"
              value={summary?.all_valid ? "OK" : "ALERTA"}
              icon={summary?.all_valid ? ShieldCheck : ShieldAlert}
              tone={integrityTone}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper sx={{ p: 2, borderRadius: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                PRIORIDADES OPERACIONAIS
              </Typography>
              <Stack spacing={1}>
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
                  state={called ? "flow" : "stable"}
                  label="Chamada no display"
                  detail={
                    called
                      ? `Aguardando confirmação de ${called.name}.`
                      : "Sem chamada pendente no momento."
                  }
                />
                <PriorityRow
                  state={summary?.all_valid === false ? "rigor" : "ready"}
                  label="Integridade de auditoria"
                  detail={
                    summary?.all_valid === false
                      ? `${summary.invalid_records} registro(s) inconsistentes.`
                      : "Cadeia de auditoria consistente."
                  }
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper sx={{ p: 2, borderRadius: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                PAINEL DE RISCO
              </Typography>
              <Stack spacing={1}>
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
                  value={
                    summary?.all_valid ? "Verificada" : "Revisão necessária"
                  }
                  tone={summary?.all_valid ? "ready" : "rigor"}
                />
                <RiskTag
                  icon={CheckCircle2}
                  label="Capacidade de atendimento"
                  value={
                    attendantsOnline > 0 ? "Operacional" : "Sem atendente ativo"
                  }
                  tone={attendantsOnline > 0 ? "ready" : "rigor"}
                />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

const PriorityRow = ({
  state,
  label,
  detail,
}: {
  state: "flow" | "stable" | "ready" | "watch" | "rigor";
  label: string;
  detail: string;
}) => {
  const tone: ChipProps["color"] =
    state === "ready"
      ? "success"
      : state === "watch"
        ? "warning"
        : state === "rigor"
          ? "error"
          : state === "flow"
            ? "primary"
            : "default";

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={0.75}
      alignItems={{ xs: "flex-start", md: "center" }}
      justifyContent="space-between"
      sx={{
        p: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
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
          maxWidth: "100%",
          "& .MuiChip-label": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.68rem",
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
  tone: "flow" | "ready" | "watch" | "rigor";
}) => {
  const color =
    tone === "ready"
      ? "success.main"
      : tone === "watch"
        ? "warning.main"
        : tone === "rigor"
          ? "error.main"
          : "primary.main";

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon size={16} />
        <Typography variant="body2">{label}</Typography>
      </Stack>
      <Typography variant="caption" sx={{ color, fontWeight: 900 }}>
        {value.toUpperCase()}
      </Typography>
    </Stack>
  );
};
