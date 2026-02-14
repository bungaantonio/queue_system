// src/modules/queue/components/ControlPage.tsx
import { useContext, useState, useMemo } from "react";
import { Title } from "react-admin";
import {
  Card,
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Grid,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material";
import { AtendimentoContext } from "./AtendimentoProvider";

// Ícones
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import GroupIcon from "@mui/icons-material/Group";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<
    string,
    { label: string; color: any; variant: "filled" | "outlined" }
  > = {
    waiting: { label: "Em espera", color: "warning", variant: "outlined" },
    called_pending: { label: "Chamado", color: "info", variant: "filled" },
    being_served: { label: "No Balcão", color: "success", variant: "filled" },
  };
  const config = configs[status] || {
    label: status,
    color: "default",
    variant: "outlined",
  };

  return (
    <Chip
      label={config.label.toUpperCase()}
      color={config.color}
      variant={config.variant}
      size="small"
      sx={{ fontWeight: 700, fontSize: "0.65rem" }}
    />
  );
};

export const ControlPage = () => {
  // 1. TODOS OS HOOKS NO TOPO
  const context = useContext(AtendimentoContext);
  const [actionLoading, setActionLoading] = useState(false);

  // Memoização calculada antes de qualquer return condicional
  const stats = useMemo(
    () => ({
      total: context?.queue?.length || 0,
      next: context?.queue?.[0] || null,
    }),
    [context?.queue],
  );

  // 2. VERIFICAÇÃO DE LOADING APÓS OS HOOKS
  if (!context || context.loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={50} />
        <Typography sx={{ mt: 2, color: "text.secondary", fontWeight: 500 }}>
          Sincronizando fila em tempo real...
        </Typography>
      </Box>
    );
  }

  // 3. DESESTRUTURAÇÃO DO CONTEXTO
  const { queue, called, current, callNext, finish, skip, cancel } = context;

  const handleAction = async (actionFn: () => Promise<any>) => {
    setActionLoading(true);
    try {
      await actionFn();
    } catch (e) {
      console.error("Erro na operação:", e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: "1600px", margin: "0 auto" }}>
      <Title title="Gestão de Fila" />

      <Grid container spacing={3}>
        {/* --- LADO ESQUERDO: OPERACIONAL --- */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: "grey.50",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <RecordVoiceOverIcon color="primary" />
                  <Typography variant="h6" fontWeight="700">
                    Painel de Atendimento
                  </Typography>
                </Stack>
                {actionLoading && <CircularProgress size={20} />}
              </Box>

              <Box sx={{ p: { xs: 4, md: 8 }, textAlign: "center" }}>
                {!current && !called ? (
                  <Box py={2}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.50",
                        color: "primary.main",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                      Balcão Disponível
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4 }}
                    >
                      Não há ninguém a ser atendido neste momento.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleAction(callNext)}
                      disabled={actionLoading || stats.total === 0}
                      startIcon={<NotificationsActiveIcon />}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontSize: "1.1rem",
                      }}
                    >
                      Chamar Próximo Utente
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="overline"
                      color="primary"
                      sx={{ fontWeight: 800, letterSpacing: 1 }}
                    >
                      {current ? "A ATENDER AGORA" : "UTENTE CHAMADO"}
                    </Typography>

                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "4rem", md: "7rem" },
                        color: "text.primary",
                        lineHeight: 1,
                        my: 2,
                      }}
                    >
                      {current?.position || called?.position}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{ mb: 5, color: "text.secondary", fontWeight: 400 }}
                    >
                      {current?.name || called?.name}
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      justifyContent="center"
                    >
                      {called && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => handleAction(callNext)}
                          sx={{
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                          }}
                          startIcon={<PlayArrowIcon />}
                        >
                          Confirmar Presença
                        </Button>
                      )}

                      {current && (
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={() => handleAction(finish)}
                          sx={{
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            fontWeight: 700,
                          }}
                          startIcon={<DoneAllIcon />}
                        >
                          Finalizar Atendimento
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        onClick={() => handleAction(skip)}
                        sx={{ px: 4, py: 2, borderRadius: 2, fontWeight: 700 }}
                        startIcon={<SkipNextIcon />}
                      >
                        Utente Ausente
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Box>
            </Card>

            {stats.total > 10 && (
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                A fila está com carga elevada: <strong>{stats.total}</strong>{" "}
                pessoas.
              </Alert>
            )}
          </Stack>
        </Grid>

        {/* --- LADO DIREITO: FILA --- */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon color="action" />
                <Typography variant="subtitle1" fontWeight="700">
                  Fila de Espera
                </Typography>
              </Stack>
              <Chip label={stats.total} size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Box
              sx={{
                p: 2,
                flexGrow: 1,
                overflowY: "auto",
                bgcolor: "grey.50",
                maxHeight: "70vh",
              }}
            >
              {queue.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Typography variant="body2" color="text.secondary">
                    Fila vazia
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {queue.map((item, index) => (
                    <Paper
                      key={item.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: index === 0 ? "primary.main" : "divider",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 800, lineHeight: 1 }}
                        >
                          {item.position}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          {item.name}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <StatusBadge status={item.status} />
                        <IconButton
                          size="small"
                          onClick={() => handleAction(() => cancel(item.id))}
                        >
                          <DeleteOutlineIcon fontSize="small" color="error" />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
