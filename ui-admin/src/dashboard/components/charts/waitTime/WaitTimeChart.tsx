// components/charts/waitTime/WaitTimeChart.tsx
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Clock } from 'lucide-react';
import { WaitTimePoint } from './types';
import { WaitTimeBar } from './WaitTimeBar';
import { WAITTIME_CHART_LABELS } from './labels';

interface Props {
    data: WaitTimePoint[];
}

export const WaitTimeChart = ({ data }: Props) => {
    const min = Math.min(...data.map(d => d.time));
    const max = Math.max(...data.map(d => d.time));
    const avg = Math.round(data.reduce((acc, d) => acc + d.time, 0) / data.length);

    return (
        <Card sx={{ height: 400 }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'primary.50',
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                        }}
                    >
                        <Clock size={20} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {WAITTIME_CHART_LABELS.title}
                    </Typography>
                </Box>

                {/* Chart */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', flex: 1, px: 1 }}>
                    {data.map((item) => (
                        <WaitTimeBar key={item.hour} hour={item.hour} time={item.time} min={min} max={max} />
                    ))}
                </Box>

                {/* Summary */}
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {WAITTIME_CHART_LABELS.average}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {avg} min
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            {WAITTIME_CHART_LABELS.peak}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {max} min
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            {WAITTIME_CHART_LABELS.lowest}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {min} min
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
