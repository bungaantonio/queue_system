import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { TrendingUp } from 'lucide-react';

export const ChartSLA = () => {
  const slaMetrics = [
    { label: 'Target Response Time', current: '94.2%', target: '95%', status: 'warning' },
    { label: 'Resolution Time', current: '97.8%', target: '98%', status: 'success' },
    { label: 'First Contact Resolution', current: '91.5%', target: '90%', status: 'success' },
    { label: 'Customer Satisfaction', current: '96.3%', target: '95%', status: 'success' },
  ];

  const overallSLA = 94.2;
  const targetSLA = 95;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'success.50';
      case 'warning':
        return 'warning.50';
      case 'error':
        return 'error.50';
      default:
        return 'grey.50';
    }
  };

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 1, 
              backgroundColor: 'success.50', 
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
          >
            <TrendingUp size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            SLA Performance
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <CircularProgress
              variant="determinate"
              value={overallSLA}
              size={120}
              thickness={4}
              sx={{
                color: 'success.main',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {overallSLA}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Overall SLA
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Target: {targetSLA}%
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
              -0.8% below target
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          {slaMetrics.map((metric, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {metric.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: {metric.target}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: getStatusColor(metric.status)
                  }}
                >
                  {metric.current}
                </Typography>
                <Box 
                  sx={{ 
                    px: 1, 
                    py: 0.25, 
                    borderRadius: 1,
                    backgroundColor: getStatusBg(metric.status),
                    color: getStatusColor(metric.status),
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}
                >
                  {metric.status}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Service Level Agreement Compliance
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              Meeting all targets: <Typography component="span" sx={{ fontWeight: 600, color: 'success.main' }}>
                3 of 4 metrics
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
