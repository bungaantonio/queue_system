import { useQueue } from "../../queue/QueueContext";
import { QueueActions } from "./QueueActions";
import {
  Paper,
  Typography,
  Divider,
  Stack,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleIcon from "@mui/icons-material/People";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  ATTENDANCE_TYPE_LABELS,
  ATTENDANCE_TYPE_COLOR,
} from "../../queue/labels";
import type { QueueUser } from "../../modules/queue/types";

export const QueueList = () => {
  const { queue, called, current, loading, callNext, skip, loadingAction } =
    useQueue();

  if (loading)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
        <CircularProgress size={32} thickness={4} />
        <Typography color="text.secondary" mt={2} variant="body2">
          Sincronizando fila...
        </Typography>
      </Stack>
    );

  const canCallNext = !current && called.length === 0;
  const canSkip = called.length > 0;

  const EmptyState = ({ message }: { message: string }) => (
    <Box sx={{ py: 4, textAlign: "center", opacity: 0.6 }}>
      <Typography variant="body2">{message}</Typography>
    </Box>
  );

  const renderListItem = (item: QueueUser, isCalled: boolean) => (
    <ListItem
      key={item.id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: isCalled ? "warning.50" : "background.paper",
        border: "1px solid",
        borderColor: isCalled ? "warning.200" : "divider",
        transition: "all 0.2s",
        "&:hover": {
          borderColor: isCalled ? "warning.main" : "primary.main",
          transform: "translateX(4px)",
        },
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            {item.name}
          </Typography>
          {item.attendance_type !== "normal" && (
            <Chip
              label={ATTENDANCE_TYPE_LABELS[item.attendance_type]}
              size="small"
              color={ATTENDANCE_TYPE_COLOR[item.attendance_type]}
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Chegada:{" "}
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Stack>
      <QueueActions userId={item.id} status={item.status} />
    </ListItem>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
      }}
    >
      {/* Chamados */}
      <Paper
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <NotificationsActiveIcon color="warning" />
          <Typography variant="h6">Chamados</Typography>
          <Chip
            label={called.length}
            size="small"
            color="warning"
            variant="outlined"
          />
        </Stack>

        <Box sx={{ minHeight: 200 }}>
          {called.length > 0 ? (
            <List disablePadding>
              {called.map((item) => renderListItem(item, true))}
            </List>
          ) : (
            <EmptyState message="Nenhum usuário aguardando atendimento após chamada" />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="warning"
            onClick={skip}
            disabled={!canSkip || loadingAction}
            startIcon={
              loadingAction ? <CircularProgress size={16} /> : <SkipNextIcon />
            }
          >
            Pular
          </Button>
        </Stack>
      </Paper>

      {/* Fila de espera */}
      <Paper
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
          <PeopleIcon color="primary" />
          <Typography variant="h6">Fila de Espera</Typography>
          <Chip label={queue.length} size="small" color="default" />
        </Stack>

        <Box sx={{ minHeight: 200, maxHeight: 400, overflowY: "auto", pr: 1 }}>
          {queue.length > 0 ? (
            <List disablePadding>
              {queue.map((item) => renderListItem(item, false))}
            </List>
          ) : (
            <EmptyState message="Fila vazia" />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant="contained"
          size="large"
          color="primary"
          onClick={callNext}
          disabled={!canCallNext || loadingAction}
          startIcon={
            loadingAction ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PlayArrowIcon />
            )
          }
          sx={{ py: 1.5 }}
        >
          Chamar Próximo
        </Button>
      </Paper>
    </Box>
  );
};
