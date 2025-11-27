import { Grid } from '@mui/material';
import { ChartWaitTime } from './ChartWaitTime';
import { ChartVolume } from './ChartVolume';
import { ChartSLA } from './ChartSLA';

export const ChartSection = () => {
    return (
        <Grid
            container
            sx={{
                mb: 4,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                gap: 24,
            }}
        >
            <ChartWaitTime />
            <ChartSLA />
            <Grid
                sx={{
                    gridColumn: '1 / -1', // ocupa toda a largura
                }}
            >
                <ChartVolume />
            </Grid>
        </Grid>
    );
};
