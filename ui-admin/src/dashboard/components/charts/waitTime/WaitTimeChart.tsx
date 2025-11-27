// components/charts/waitTime/WaitTimeChart.tsx

import { Card, CardContent, Typography, Box } from '@mui/material';
import { Clock } from 'lucide-react';
import { WaitTimePoint } from './types';

import { WaitTimeBar } from './WaitTimeBar';
import { WaitTimeSummary } from './WaitTimeSummary';

import { getMaxTime, getMinTime, getRange, getHeightPercent } from './utils';

interface Props {
    data: WaitTimePoint[];
}

export const WaitTimeChart = ({ data }: Props) => {
    const min = getMinTime(data);
    const range = getRange(data);

    return (
        <Card sx={{ height: 400 }}>
            <CardContent
                sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Header */}
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
                        Wait Time Trend
                    </Typography>
                </Box>

                {/* Chart */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-end',
                        px: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {data.map(item => (
                            <WaitTimeBar
                                key={item.hour}
                                hour={item.hour}
                                time={item.time}
                                heightPercent={getHeightPercent(item.time, min, range)}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Summary */}
                <WaitTimeSummary data={data} />
            </CardContent>
        </Card>
    );
};
