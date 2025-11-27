// ChartSection.tsx
import { Box } from '@mui/material';
import { WaitTimeChart } from './waitTime/WaitTimeChart';
import { VolumeChart } from './volume/VolumeChart';
import { SLAMetricsChart } from './sla/SLAMetricsChart';

import { VolumeData } from "./volume/types";

export const volumeData: VolumeData = {
    weekTotal: 627,
    previousWeekTotal: 577,
    averageTrend: 8,
    days: [
        { day: "Mon", current: 85, previous: 78, trend: 9 },
        { day: "Tue", current: 92, previous: 88, trend: 5 },
        { day: "Wed", current: 76, previous: 82, trend: -7 },
        { day: "Thu", current: 103, previous: 95, trend: 8 },
        { day: "Fri", current: 118, previous: 102, trend: 16 },
        { day: "Sat", current: 89, previous: 74, trend: 20 },
        { day: "Sun", current: 64, previous: 58, trend: 10 },
    ],
};

const waitTimeData = [
    { hour: '9 AM', time: 6.2 },
    { hour: '10 AM', time: 8.5 },
    { hour: '11 AM', time: 12.1 },
    { hour: '12 PM', time: 9.8 },
    { hour: '1 PM', time: 11.3 },
    { hour: '2 PM', time: 15.2 },
    { hour: '3 PM', time: 13.6 },
    { hour: '4 PM', time: 10.9 },
    { hour: '5 PM', time: 8.7 },
];


export const ChartSection = () => (
    <Box
        sx={{
            mb: 4,
            display: 'grid',
            gap: 3, // 24px
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gridAutoRows: 'minmax(220px, auto)',
        }}
    >
        {/* Wait time chart ocupa mais espaço */}
        <Box sx={{ gridColumn: { xs: '1', md: '1' } }}>
            <WaitTimeChart data={waitTimeData} />
        </Box>

        {/* SLA metrics chart ocupa coluna menor */}
        <Box sx={{ gridColumn: { xs: '1', md: '2' } }}>
            <SLAMetricsChart />
        </Box>

        {/* Volume chart ocupa toda a largura abaixo */}
        <Box sx={{ gridColumn: '1 / -1' }}>
            <VolumeChart data={volumeData} />

        </Box>
    </Box>
);
