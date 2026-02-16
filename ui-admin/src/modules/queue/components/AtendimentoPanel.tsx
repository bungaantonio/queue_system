// src/modules/queue/components/AtendimentoPanel.tsx
import { useContext } from "react";
import { Title } from "react-admin";
import {
  Box,
  Button,
  Stack,
  Paper,
  Grid,
  alpha,
  Chip,
  Typography,
} from "@mui/material";
import { Play, CheckCircle2, UserX } from "lucide-react";
import { AtendimentoContext } from "./AtendimentoProvider";
import { StatusHero } from "./StatusHero";
import { QueueSidebar } from "./QueueSidebar";
import { StatusChip } from "../../shared/components/StatusChip";

export const AtendimentoPanel = () => {
  const context = useContext(AtendimentoContext);

  if (!context || context.loading) {
    return (
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        <Typography variant="body2" color="text.secondary">
          A carregar estado de atendimento...
        </Typography>
      </Paper>
    );
  }

  const { queue, called, current, callNext, finish, skip, cancel } = context;
  const activeUser = current || called;
  const isPending = !!called;
  const isInService = Boolean(current) && !isPending;
  const mode = isPending
    ? "A aguardar confirmação"
    : isInService
      ? "Em atendimento"
      : "Balcão disponível";
  const panelTone = isPending
    ? "flow"
    : isInService
      ? "ready"
      : queue.length > 5
        ? "watch"
        : "stable";

  return (
    <Box sx={{ minHeight: { md: 540 } }}>
      <Title title="Painel de Atendimento" />

      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              minHeight: { xs: 320, md: 440 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 2, md: 3 },
              borderRadius: 5,
              position: "relative",
              overflow: "hidden",
              transition: "background-color 0.4s ease, border-color 0.2s ease",
              bgcolor:
                panelTone === "flow"
                  ? "primary.main"
                  : panelTone === "ready"
                    ? (theme) => alpha(theme.palette.success.main, 0.08)
                    : "background.paper",
              border: "1px solid",
              borderColor:
                panelTone === "flow"
                  ? "primary.dark"
                  : panelTone === "ready"
                    ? "success.light"
                    : panelTone === "watch"
                      ? "warning.light"
                      : "divider",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ mb: 1.25 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: isPending
                    ? "rgba(255,255,255,0.85)"
                    : "text.secondary",
                }}
              >
                {mode}
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ flexWrap: "wrap", rowGap: 0.75 }}
              >
                <StatusChip
                  label={`${queue.length} em espera`}
                  color={queue.length > 5 ? "warning" : "success"}
                  sx={{ height: 22, fontWeight: 800 }}
                />
                <StatusChip
                  label={
                    panelTone === "flow"
                      ? "Fluxo ativo"
                      : panelTone === "ready"
                        ? "Pronto"
                        : panelTone === "watch"
                          ? "Vigilância"
                          : "Passivo"
                  }
                  color={
                    panelTone === "flow"
                      ? "primary"
                      : panelTone === "ready"
                        ? "success"
                        : panelTone === "watch"
                          ? "warning"
                          : "default"
                  }
                  sx={{ height: 22, fontWeight: 800 }}
                />
                {activeUser?.ticket ? (
                  <Chip
                    size="small"
                    label={`#${activeUser.ticket}`}
                    color={isPending ? "default" : "primary"}
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontFamily: "monospace",
                      fontWeight: 900,
                    }}
                  />
                ) : null}
              </Stack>
            </Stack>

            <StatusHero user={activeUser} isPending={isPending} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mt: 2, flexWrap: "wrap" }}
            >
              {!activeUser ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={callNext}
                  disabled={queue.length === 0}
                  startIcon={<Play size={20} fill="currentColor" />}
                  sx={{
                    px: { xs: 3, md: 6 },
                    py: 1.25,
                    borderRadius: 3,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Chamar Próximo Utente
                </Button>
              ) : (
                <>
                  {isPending ? (
                    <Button
                      variant="contained"
                      onClick={callNext}
                      startIcon={<CheckCircle2 size={20} />}
                      sx={{
                        bgcolor: "white",
                        color: "primary.main",
                        "&:hover": {
                          bgcolor: (theme) =>
                            alpha(theme.palette.common.white, 0.9),
                        },
                        px: 3,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Confirmar Presença
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={finish}
                      startIcon={<CheckCircle2 size={20} />}
                      sx={{ px: 3, width: { xs: "100%", sm: "auto" } }}
                    >
                      Finalizar Atendimento
                    </Button>
                  )}
                  <Button
                    variant={isPending ? "text" : "outlined"}
                    color="error"
                    onClick={skip}
                    startIcon={<UserX size={20} />}
                    sx={{
                      px: 3,
                      color: isPending ? "white" : "error.main",
                      borderColor: isPending
                        ? (theme) => alpha(theme.palette.common.white, 0.3)
                        : "error.main",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Marcar Ausência
                  </Button>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <QueueSidebar queue={queue} onCancel={cancel} />
        </Grid>
      </Grid>
    </Box>
  );
};
