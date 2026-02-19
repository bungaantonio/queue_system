// src/modules/queue/components/AtendimentoPanel.tsx
import { useContext } from "react";
import { Title } from "react-admin";
import {
  Button,
  Stack,
  Paper,
  Grid,
  Box,
  Typography,
  alpha,
} from "@mui/material";
import { Play, CheckCircle2, UserX } from "lucide-react";
import { AtendimentoContext } from "./AtendimentoProvider";
import { StatusHero } from "./StatusHero";
import { QueueSidebar } from "./QueueSidebar";
import { StatusChip } from "../../shared/components/StatusChip";
import { PageContainer } from "../../shared/components/PageContainer";

export const AtendimentoPanel = () => {
  const context = useContext(AtendimentoContext);

  if (!context || context.loading) {
    return (
      <Paper elevation={0} sx={{ mt: 2, p: 2.5, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          A carregar estado de atendimento...
        </Typography>
      </Paper>
    );
  }

  const { queue, called, current, callNext, finish, skip, cancel } = context;

  const isCalled = !!called && !current;
  const isActive = !!current;
  const activeUser = current || called;
  const panelBlue = isCalled;

  return (
    <PageContainer sx={{ minHeight: { md: 540 } }}>
      <Title title="Painel de Atendimento" />

      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              height: { xs: "auto", md: 520 },
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: panelBlue
                ? "primary.dark"
                : (theme) => alpha(theme.palette.divider, 0.8),
              background: panelBlue
                ? (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                : (theme) =>
                    `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.6)} 100%)`,
              transition: "border-color 0.3s ease, background 0.4s ease",
            }}
          >
            {/* Barra de status — label só existe quando há atendimento ativo */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 2,
                py: 1,
                borderBottom: "1px solid",
                borderColor: panelBlue
                  ? (theme) => alpha(theme.palette.common.white, 0.15)
                  : (theme) => alpha(theme.palette.divider, 0.6),
              }}
            >
              {isActive ? (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  Em atendimento
                </Typography>
              ) : (
                <Box />
              )}

              <StatusChip
                label={`${queue.length} em espera`}
                color={queue.length > 5 ? "warning" : "success"}
                sx={{ height: 20, fontWeight: 800 }}
              />
            </Stack>

            {/* Hero — recebe user e isPending, comunica o estado visualmente */}
            <Box sx={{ flex: 1, display: "flex", px: 3, py: 2 }}>
              <StatusHero user={activeUser} isPending={isCalled} />
            </Box>

            {/* Botões */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{
                px: 2.5,
                py: 2,
                borderTop: "1px solid",
                borderColor: panelBlue
                  ? (theme) => alpha(theme.palette.common.white, 0.15)
                  : (theme) => alpha(theme.palette.divider, 0.6),
              }}
            >
              {!activeUser && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={callNext}
                  disabled={queue.length === 0}
                  startIcon={<Play size={18} fill="currentColor" />}
                  sx={{ flex: 1, py: 1.25, borderRadius: 2 }}
                >
                  Chamar Próximo
                </Button>
              )}

              {isCalled && (
                <Button
                  variant="outlined"
                  onClick={skip}
                  startIcon={<UserX size={18} />}
                  sx={{
                    flex: 1,
                    py: 1.1,
                    borderRadius: 2,
                    color: "white",
                    borderColor: (theme) =>
                      alpha(theme.palette.common.white, 0.4),
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: (theme) =>
                        alpha(theme.palette.common.white, 0.08),
                    },
                  }}
                >
                  Marcar Ausência
                </Button>
              )}

              {isActive && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={finish}
                    startIcon={<CheckCircle2 size={18} />}
                    sx={{ flex: 1, py: 1.1, borderRadius: 2 }}
                  >
                    Finalizar Atendimento
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={skip}
                    startIcon={<UserX size={18} />}
                    sx={{ py: 1.1, borderRadius: 2, px: 3 }}
                  >
                    Marcar Ausência
                  </Button>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Box sx={{ height: { xs: "auto", md: 520 } }}>
            <QueueSidebar queue={queue} onCancel={cancel} />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
