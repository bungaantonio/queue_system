import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { Users } from 'lucide-react';

export const ChartVolume = () => {
  // Mock data for volume comparison
  const volumeData = [
    { day: 'Monday', current: 85, previous: 78, trend: 9 },
    { day: 'Tuesday', current: 92, previous: 88, trend: 5 },
    { day: 'Wednesday', current: 76, previous: 82, trend: -7 },
    { day: 'Thursday', current: 103, previous: 95, trend: 8 },
    { day: 'Friday', current: 118, previous: 102, trend: 16 },
    { day: 'Saturday', current: 89, previous: 74, trend: 20 },
    { day: 'Sunday', current: 64, previous: 58, trend: 10 },
  ];

  const maxValue = Math.max(...volumeData.map(d => d.current));

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 1, 
              backgroundColor: 'info.50', 
              color: 'info.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
          >
            <Users size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Weekly Volume
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          {volumeData.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.day}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.current}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: item.trend >= 0 ? 'success.main' : 'error.main',
                      fontSize: '0.8rem'
                    }}
                  >
                    {item.trend >= 0 ? '+' : ''}{item.trend}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ position: 'relative' }}>
                <LinearProgress
                  variant="determinate"
                  value={(item.current / maxValue) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #0284C7 0%, #0EA5E9 100%)',
                    }
                  }}
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: `${(item.previous / maxValue) * 100}%`, 
                    height: '8px',
                    backgroundColor: 'rgba(148, 163, 184, 0.3)',
                    borderRadius: 4,
                  }} 
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Previous: {item.previous}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Total Week</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {volumeData.reduce((sum, item) => sum + item.current, 0)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">vs. Last Week</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                color: 'success.main'
              }}
            >
              +{Math.round(volumeData.reduce((sum, item) => sum + item.trend, 0) / volumeData.length)}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
