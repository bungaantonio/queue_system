// src/dashboard/components/QueueActions.tsx
import { useState } from "react";
import { useQueue } from "../queue/QueueContext";
import type { UserStatus } from "../queue/types";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, Stack, CircularProgress } from "@mui/material";

interface Props {
    userId: number;
    status: UserStatus;
}

export const QueueActions = ({ userId, status }: Props) => {
    const { finish, cancel, requeue, skip, loadingAction, loadingActions } = useQueue();
    const [open, setOpen] = useState(false);
    const [attendanceType, setAttendanceType] = useState<"normal" | "urgent" | "priority">("normal");

    const handleRequeue = async () => {
        await requeue(userId, attendanceType);
        setOpen(false);
    };

    const userLoading = loadingActions?.[userId] || false;

    const renderButtons = () => {
        switch (status) {
            case "being_served":
                return (
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={finish}
                            disabled={loadingAction || userLoading}
                            startIcon={userLoading ? <CircularProgress size={20} /> : null}
                        >
                            Finalizar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => cancel(userId)}
                            disabled={loadingAction || userLoading}
                            startIcon={userLoading ? <CircularProgress size={20} /> : null}
                        >
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={() => setOpen(true)}>
                            Reagendar
                        </Button>
                    </Stack>
                );
            case "called_pending":
                return (
                    <>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={skip}
                                disabled={loadingAction || userLoading}
                                startIcon={userLoading ? <CircularProgress size={20} /> : null}
                            >
                                Pular
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => cancel(userId)}
                                disabled={loadingAction || userLoading}
                                startIcon={userLoading ? <CircularProgress size={20} /> : null}
                            >
                                Cancelar
                            </Button>
                            <Button variant="contained" onClick={() => setOpen(true)}>
                                Reagendar
                            </Button>
                        </Stack>

                        <Dialog open={open} onClose={() => setOpen(false)}>
                            <DialogTitle>Reagendar Atendimento</DialogTitle>
                            <DialogContent>
                                <Select
                                    fullWidth
                                    value={attendanceType}
                                    onChange={e =>
                                        setAttendanceType(e.target.value as "normal" | "urgent" | "priority")
                                    }
                                >
                                    <MenuItem value="normal">Normal</MenuItem>
                                    <MenuItem value="urgent">Urgente</MenuItem>
                                    <MenuItem value="priority">Priority</MenuItem>
                                </Select>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>Cancelar</Button>
                                <Button onClick={handleRequeue} variant="contained">
                                    Confirmar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                );
            default:
                return null;
        }
    };

    return renderButtons();
};
