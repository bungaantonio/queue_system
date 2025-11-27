// src/dashboard/components/volume/VolumeSummary.tsx

import { Box, Typography } from "@mui/material";
import { VolumeData } from "./types";

interface Props {
    data: VolumeData;
}

export const VolumeSummary = ({ data }: Props) => {
    const positive = data.averageTrend >= 0;

    return (
        <Box sx={{ mb: 2 }}>

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Resumo da Semana
            </Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>
                Total: <strong>{data.weekTotal}</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
                Semana anterior: {data.previousWeekTotal}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    mt: 1,
                    fontWeight: 600,
                    color: positive ? "success.main" : "error.main",
                }}
            >
                {positive ? "Semana positiva" : "Semana negativa"}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
                Tendência média: {positive ? "▲" : "▼"} {Math.abs(data.averageTrend)}%
            </Typography>
        </Box>
    );
};
