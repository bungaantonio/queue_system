import { Box, Typography } from "@mui/material";
import { DayVolume } from "./types";
import { VOLUME_CHART_LABELS as L } from "./labels";

interface Props {
    item: DayVolume;
}

export const VolumeBar = ({ item }: Props) => {
    const barHeight = Math.min(100, item.current);     // escala simples
    const previousHeight = Math.min(100, item.previous);

    const isPositive = item.trend >= 0;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>

            {/* Indicador de tendência */}
            <Typography
                variant="body2"
                sx={{
                    fontWeight: 600,
                    color: isPositive ? "success.main" : "error.main",
                }}
            >
                {isPositive ? L.trendUp : L.trendDown} {Math.abs(item.trend)}%
            </Typography>

            {/* Gráfico vertical */}
            <Box sx={{ position: "relative", height: 110, width: 22 }}>

                {/* Barra da semana anterior (cinza claro) */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: previousHeight,
                        bgcolor: "grey.300",
                        borderRadius: 1,
                        opacity: 0.4,
                    }}
                />

                {/* Barra atual */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: barHeight,
                        bgcolor: isPositive ? "success.main" : "error.main",
                        borderRadius: 1,
                    }}
                />
            </Box>

            {/* Nome do dia */}
            <Typography variant="caption">
                {item.day}
            </Typography>
        </Box>
    );
};
