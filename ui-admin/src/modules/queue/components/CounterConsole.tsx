// src/modules/queue/components/CounterConsole.tsx
import { useContext } from "react";
import { Title } from "react-admin";
import { Box, Button, Stack, Paper, Grid, alpha } from "@mui/material";
import { AtendimentoContext } from "./AtendimentoProvider";
import { StatusHero } from "./StatusHero";
import { QueueSidebar } from "./QueueSidebar";
import { Play, CheckCircle2, UserX } from "lucide-react";

export const CounterConsole = () => {
  const context = useContext(AtendimentoContext);

  if (!context || context.loading) return null; // Aqui entra o Skeleton/Loading state

  const { queue, called, current, callNext, finish, skip, cancel } = context;
  const activeUser = current || called;
  const isPending = !!called;
  const isInService = Boolean(current) && !isPending;

  return (
    <Box sx={{ minHeight: { xs: 480, md: 540 } }}>
      <Title title="Consola Operacional" />

      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        {/* LADO ESQUERDO: ÁREA DE COMANDO */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              minHeight: { xs: 360, md: 440 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 2, md: 3 },
              borderRadius: 5,
              position: "relative",
              overflow: "hidden",
              transition: "background-color 0.6s ease",
              bgcolor: isPending ? "primary.main" : "background.paper",
              border: "1px solid",
              borderColor: isPending
                ? "primary.dark"
                : isInService
                  ? "success.light"
                  : "divider",
            }}
          >
            <StatusHero user={activeUser} isPending={isPending} />

            {/* BARRA DE AÇÕES INFERIOR */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 2, flexWrap: "wrap" }}
            >
              {!activeUser ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={callNext}
                  startIcon={<Play size={20} fill="currentColor" />}
                  sx={{ px: { xs: 4, md: 6 }, py: 1.25, borderRadius: 3 }}
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
                        "&:hover": { bgcolor: alpha("#fff", 0.9) },
                        px: 3,
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
                      sx={{ px: 3 }}
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
                        ? alpha("#fff", 0.3)
                        : "error.main",
                    }}
                  >
                    Marcar Ausência
                  </Button>
                </>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* LADO DIREITO: GESTÃO DA FILA */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <QueueSidebar queue={queue} onCancel={cancel} />
        </Grid>
      </Grid>
    </Box>
  );
};
