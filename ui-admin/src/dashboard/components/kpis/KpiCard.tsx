import { Card, CardContent, Box, Typography } from '@mui/material';
import { Kpi } from './types';
import { colorMap, getTrendColor, formatTrend } from './utils';

export const KpiCard = ({ title, value, subtitle, icon, color = 'primary', trend }: Kpi) => {
    const colors = colorMap[color];

    return (
        <Card
            sx={{
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                },
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                            {title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: getTrendColor(trend.isPositive) }}>
                                    {formatTrend(trend.value, trend.isPositive)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                    vs. yesterday
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: colors.bg,
                            color: colors.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 56,
                            minHeight: 56,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
