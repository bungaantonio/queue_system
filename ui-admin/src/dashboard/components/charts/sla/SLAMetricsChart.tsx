// components/charts/sla/SLAMetricsChart.tsx

import { Card, CardContent, Typography, Box, CircularProgress, Stack, Divider } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import { SLAMetricRow } from './SLAMetricRow';
import { SLAMetric } from './types';
import { calculateOverallSLA } from './utils';

export const SLAMetricsChart = () => {
  const slaMetrics: SLAMetric[] = [
    { label: 'Tempo de Resposta', current: 94.2, target: 95, status: 'warning' },
    { label: 'Tempo de Resolução', current: 97.8, target: 98, status: 'success' },
    { label: 'Resolução ao Primeiro Contacto', current: 91.5, target: 90, status: 'success' },
    { label: 'Satisfação do Cliente', current: 96.3, target: 95, status: 'success' },
  ];

  const overallSLA = calculateOverallSLA(slaMetrics);
  const targetSLA = 95;

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>

        {/* Cabeçalho */}
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
            Desempenho SLA
          </Typography>
        </Stack>

        {/* Indicador global */}
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
                  SLA Global
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              Meta: {targetSLA}%
            </Typography>
            <Typography
              variant="body2"
              color={overallSLA >= targetSLA ? 'success.main' : 'warning.main'}
              sx={{ fontWeight: 500 }}
            >
              {overallSLA < targetSLA
                ? `-${(targetSLA - overallSLA).toFixed(1)}% abaixo da meta`
                : 'Dentro da meta'}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Lista de métricas */}
        <Stack spacing={1} sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {slaMetrics.map(metric => (
            <SLAMetricRow key={metric.label} metric={metric} />
          ))}
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Resumo */}
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Cumprimento do Acordo de Nível de Serviço
          </Typography>
          <Typography variant="body2">
            Métricas dentro da meta:{' '}
            <Typography component="span" sx={{ fontWeight: 600, color: 'success.main' }}>
              {slaMetrics.filter(m => m.status === 'success').length} de {slaMetrics.length} métricas
            </Typography>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
