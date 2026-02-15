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

  return (
    <Box sx={{ height: "calc(100vh - 140px)", minHeight: 600 }}>
      <Title title="Consola Operacional" />

      <Grid container spacing={4} sx={{ height: "100%" }}>
        {/* LADO ESQUERDO: ÁREA DE COMANDO */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }} sx={{ height: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 6,
              borderRadius: 8,
              position: "relative",
              overflow: "hidden",
              transition: "background-color 0.6s ease",
              bgcolor: isPending ? "primary.main" : "background.paper",
              border: "1px solid",
              borderColor: isPending ? "primary.dark" : "divider",
            }}
          >
            <StatusHero user={activeUser} isPending={isPending} />

            {/* BARRA DE AÇÕES INFERIOR */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              {!activeUser ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={callNext}
                  startIcon={<Play size={20} fill="currentColor" />}
                  sx={{ px: 10, py: 2, fontSize: "1.1rem", borderRadius: 4 }}
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
                        px: 5,
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
                      sx={{ px: 5 }}
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
                      px: 5,
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
        <Grid size={{ xs: 12, md: 5, lg: 4 }} sx={{ height: "100%" }}>
          <QueueSidebar queue={queue} onCancel={cancel} />
        </Grid>
      </Grid>
    </Box>
  );
};
