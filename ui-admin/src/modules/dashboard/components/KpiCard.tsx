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
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                },
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                    {/* Bloco de Texto */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="body2" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                        {trend && (
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: getTrendColor(trend.isPositive), mt: 0.5 }}
                            >
                                {formatTrend(trend.value, trend.isPositive)} vs. ontem
                            </Typography>
                        )}
                    </Box>

                    {/* Ícone */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: colors.bg,
                            color: colors.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 56,
                            minHeight: 56,
                            ml: 2,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
