// src/control/components/QueueList.tsx
import { useQueue } from "../queue/QueueContext";
import { QueueActions } from "./QueueActions";
import { Paper, Typography, Divider, Stack, List, ListItem, Chip, CircularProgress, Button } from "@mui/material";
import type { QueueUser } from "../queue/types";

const statusColor: Record<QueueUser["status"], "default" | "warning" | "success" | "info" | "error"> = {
    waiting: "default",
    called_pending: "warning",
    being_served: "success",
    done: "info",
    cancelled: "error",
};

export const QueueList = () => {
    const { queue, called, current, loading, callNext, skip, loadingAction } = useQueue();

    if (loading)
        return (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                <CircularProgress />
                <Typography color="textSecondary" mt={2}>
                    Carregando fila...
                </Typography>
            </Stack>
        );

    const canCallNext = !current && called.length === 0;
    const canSkip = called.length > 0;

    const renderList = (items: QueueUser[]) => (
        <List>
            {items.map(item => (
                <ListItem
                    key={item.id}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 1
                    }}
                >
                    <Stack spacing={0.5}>
                        <Typography component="div">
                            {item.name}{" "}
                            <Chip
                                label={item.status.replace("_", " ")}
                                color={statusColor[item.status]}
                                size="small"
                                variant="outlined"
                            />
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {item.attendance_type ? `${item.attendance_type} – ` : ""}
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </Typography>
                    </Stack>

                    <QueueActions userId={item.id} status={item.status} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Paper elevation={3} sx={{ p: 3, maxHeight: 500, overflowY: "auto" }}>
            <Typography variant="h6" gutterBottom>
                Fila de Atendimento
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
                Em Espera
            </Typography>
            {queue.length > 0 ? renderList(queue) : <Typography color="textSecondary">Nenhum usuário em espera</Typography>}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
                Chamados
            </Typography>
            {called.length > 0 ? renderList(called) : <Typography color="textSecondary">Nenhum usuário chamado</Typography>}

            <Stack direction="row" spacing={2} mt={2}>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={callNext}
                        disabled={!canCallNext || loadingAction}
                        startIcon={loadingAction ? <CircularProgress size={20} /> : null}
                    >
                        Chamar Próximo
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={skip}
                        disabled={!canSkip || loadingAction}
                        startIcon={loadingAction ? <CircularProgress size={20} /> : null}
                    >
                        Pular
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    );
};
