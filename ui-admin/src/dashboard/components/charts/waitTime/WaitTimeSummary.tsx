// components/charts/waitTime/WaitTimeSummary.tsx

import { Box, Typography } from '@mui/material';
import { WaitTimePoint } from './types';
import { getMaxTime, getMinTime } from './utils';
import { WAITTIME_CHART_LABELS } from './labels';

interface Props {
    data: WaitTimePoint[];
}

export const WaitTimeSummary = ({ data }: Props) => {
    const max = getMaxTime(data);
    const min = getMinTime(data);

    const avg = Math.round(
        data.reduce((acc, item) => acc + item.time, 0) / data.length
    );

    return (
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
    );
};
