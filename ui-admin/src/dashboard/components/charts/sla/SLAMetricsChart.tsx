// components/charts/sla/SLAMetricsChart.tsx

import { Card, CardContent, Typography, Box, CircularProgress, Stack, Divider } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { SLAMetricRow } from './SLAMetricRow';
import { SLAMetric } from './types';
import { calculateOverallSLA } from './utils';

export const SLAMetricsChart = () => {
  const slaMetrics: SLAMetric[] = [
    { label: 'Target Response Time', current: 94.2, target: 95, status: 'warning' },
    { label: 'Resolution Time', current: 97.8, target: 98, status: 'success' },
    { label: 'First Contact Resolution', current: 91.5, target: 90, status: 'success' },
    { label: 'Customer Satisfaction', current: 96.3, target: 95, status: 'success' },
  ];

  const overallSLA = calculateOverallSLA(slaMetrics);
  const targetSLA = 95;

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              backgroundColor: 'success.50',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            SLA Performance
          </Typography>
        </Stack>

        {/* Overall Circular + Target */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={overallSLA}
              size={120}
              thickness={4}
              sx={{ color: overallSLA >= targetSLA ? 'success.main' : 'warning.main' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overallSLA.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overall SLA
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Target: {targetSLA}%
            </Typography>
            <Typography
              variant="body2"
              color={overallSLA >= targetSLA ? 'success.main' : 'warning.main'}
              sx={{ fontWeight: 500 }}
            >
              {overallSLA < targetSLA
                ? `-${(targetSLA - overallSLA).toFixed(1)}% below target`
                : 'On target'}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Metrics List */}
        <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {slaMetrics.map(metric => (
            <SLAMetricRow key={metric.label} metric={metric} />
          ))}
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Summary */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Service Level Agreement Compliance
          </Typography>
          <Typography variant="body2">
            Meeting all targets:{' '}
            <Typography component="span" sx={{ fontWeight: 600, color: 'success.main' }}>
              {slaMetrics.filter(m => m.status === 'success').length} of {slaMetrics.length} metrics
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
