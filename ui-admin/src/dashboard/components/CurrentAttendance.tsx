// src/dashboard/components/CurrentAttendance.tsx
import { useQueue } from "../queue/QueueContext";
import { QueueActions } from "./QueueActions";
import { Paper, Typography, Divider, Stack, CircularProgress } from "@mui/material";

export const CurrentAttendance = () => {
    const { current, loading } = useQueue();

    if (loading) return <CircularProgress />;
    if (!current)
        return <Typography color="textSecondary">Nenhum usuário está em atendimento.</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Stack spacing={1}>
                <Typography variant="h6">Atendimento Atual</Typography>
                <Typography variant="subtitle1">
                    {current.name} – <em>{current.status.replace("_", " ").toLowerCase()}</em>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                    Chegada: {new Date(current.timestamp).toLocaleTimeString()}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <QueueActions userId={current.id} status={current.status} />
            </Stack>
        </Paper>
    );
};
