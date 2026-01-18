// src/dashboard/components/charts/ChartSection.tsx
import { Box } from "@mui/material";
import { WaitTimeChart } from "./waitTime/WaitTimeChart";
import { VolumeChart } from "./volume/VolumeChart";
import { SLAMetricsChart } from "./sla/SLAMetricsChart";

import { volumeData } from "./volume/data";
import { waitTimeData } from "./waitTime/data";

export const ChartSection = () => (
    <Box
        sx={{
            mb: 4,
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gridAutoRows: "minmax(220px, auto)",
        }}
    >
        {/* WaitTime ocupa mais espaço */}
        <Box sx={{ gridColumn: { xs: "1", md: "1" } }}>
            <WaitTimeChart data={waitTimeData} />
        </Box>

        {/* SLA ocupa coluna menor */}
        <Box sx={{ gridColumn: { xs: "1", md: "2" } }}>
            <SLAMetricsChart />
        </Box>

        {/* Volume ocupa toda largura abaixo */}
        <Box sx={{ gridColumn: "1 / -1" }}>
            <VolumeChart data={volumeData} />
        </Box>
    </Box>
);
