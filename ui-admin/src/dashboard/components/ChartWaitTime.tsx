import { Card, CardContent, Typography, Box } from '@mui/material';
import { Clock } from 'lucide-react';

export const ChartWaitTime = () => {
  // Mock data for the chart
  const data = [
    { hour: '9 AM', time: 6.2 },
    { hour: '10 AM', time: 8.5 },
    { hour: '11 AM', time: 12.1 },
    { hour: '12 PM', time: 9.8 },
    { hour: '1 PM', time: 11.3 },
    { hour: '2 PM', time: 15.2 },
    { hour: '3 PM', time: 13.6 },
    { hour: '4 PM', time: 10.9 },
    { hour: '5 PM', time: 8.7 },
  ];

  const maxTime = Math.max(...data.map(d => d.time));
  const minTime = Math.min(...data.map(d => d.time));
  const range = maxTime - minTime;

  return (
    <Card sx={{ height: 400 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
              mr: 1
            }}
          >
            <Clock size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Wait Time Trend
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', px: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', height: '100%' }}>
            {data.map((item, index) => {
              const height = ((item.time - minTime) / range) * 80 + 10;
              return (
                <Box 
                  key={index} 
                  sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mx: 0.5,
                    height: '100%'
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: `${height}%`,
                      background: 'linear-gradient(to top, #3B82F6, #60A5FA)',
                      borderRadius: '4px 4px 0 0',
                      minHeight: 20,
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(to top, #2563EB, #3B82F6)',
                      }
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 0.5, 
                      fontSize: '0.7rem',
                      textAlign: 'center'
                    }}
                  >
                    {item.hour}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.6rem',
                      color: 'text.secondary'
                    }}
                  >
                    {item.time}min
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
