import { useState } from "react";
import { useQueue } from "../../queue/QueueContext";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Stack,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import type { UserStatus } from "../../modules/queue/types";

interface Props {
  userId: number;
  status: UserStatus;
}

export const QueueActions = ({ userId, status }: Props) => {
  const { finish, cancel, requeue, skip, loadingAction, loadingActions } =
    useQueue();
  const [open, setOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState<
    "normal" | "urgent" | "priority"
  >("normal");

  const userLoading = loadingActions?.[userId] || false;

  const handleRequeue = async () => {
    await requeue(userId, attendanceType);
    setOpen(false);
  };

  if (!["being_served", "called_pending", "waiting"].includes(status))
    return null;

  return (
    <>
      <Stack direction="row" spacing={1}>
        {status === "being_served" && (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={finish}
              disabled={loadingAction || userLoading}
              startIcon={
                userLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckCircleIcon />
                )
              }
              sx={{ px: 3 }}
            >
              Finalizar
            </Button>
            <Tooltip title="Cancelar atendimento">
              <IconButton
                color="error"
                onClick={() => cancel(userId)}
                disabled={loadingAction || userLoading}
                sx={{ border: "1px solid", borderColor: "error.main" }}
              >
                {userLoading ? <CircularProgress size={20} /> : <CancelIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reagendar">
              <IconButton
                color="primary"
                onClick={() => setOpen(true)}
                sx={{ border: "1px solid", borderColor: "primary.main" }}
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {status === "called_pending" && (
          <>
            <Tooltip title="Pular usuário">
              <IconButton
                color="warning"
                onClick={skip}
                disabled={loadingAction || userLoading}
                size="small"
              >
                {userLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <SkipNextIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar">
              <IconButton
                color="error"
                onClick={() => cancel(userId)}
                disabled={loadingAction || userLoading}
                size="small"
              >
                {userLoading ? <CircularProgress size={16} /> : <CancelIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reagendar">
              <IconButton
                color="primary"
                onClick={() => setOpen(true)}
                size="small"
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {status === "waiting" && (
          <>
            <Tooltip title="Cancelar">
              <IconButton
                color="error"
                onClick={() => cancel(userId)}
                disabled={loadingAction || userLoading}
                size="small"
              >
                {userLoading ? <CircularProgress size={16} /> : <CancelIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reagendar">
              <IconButton
                color="primary"
                onClick={() => setOpen(true)}
                size="small"
              >
                <ScheduleIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      {/* Dialog de reagendamento */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Reagendar Atendimento
        </DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={attendanceType}
            onChange={(e) =>
              setAttendanceType(
                e.target.value as "normal" | "urgent" | "priority",
              )
            }
            sx={{ mt: 1 }}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="urgent">Urgente</MenuItem>
            <MenuItem value="priority">Prioridade</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleRequeue} variant="contained" disableElevation>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
