import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';

import { 
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'warning' as const,
    title: 'Queue Above Threshold',
    message: 'Current queue length (18) exceeds threshold of 15',
    time: '5 min ago',
    icon: <Users className="w-5 h-5 text-amber-500" />,
    priority: 'high' as const,
  },
  {
    id: 2,
    type: 'error' as const,
    title: 'SLA Breach Detected',
    message: '3 users have exceeded acceptable wait time',
    time: '12 min ago',
    icon: <Clock className="w-5 h-5 text-red-500" />,
    priority: 'high' as const,
  },
  {
    id: 3,
    type: 'warning' as const,
    title: 'Operator Inactivity',
    message: 'No responses from operator #2 for 15 minutes',
    time: '18 min ago',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    priority: 'medium' as const,
  },
  {
    id: 4,
    type: 'success' as const,
    title: 'Performance Target Met',
    message: 'Daily SLA compliance target achieved (94.2%)',
    time: '1 hour ago',
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    priority: 'low' as const,
  },
  {
    id: 5,
    type: 'info' as const,
    title: 'System Maintenance',
    message: 'Scheduled maintenance window: 02:00 - 04:00 AM',
    time: '2 hours ago',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    priority: 'low' as const,
  },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'warning': return <AlertTriangle size={20} />;
    case 'error':   return <XCircle size={20} />;
    case 'success': return <CheckCircle size={20} />;
    case 'info':    return <Info size={20} />;
    default:        return <Info size={20} />;
  }
};

const getAlertColor = (type: string) => {
  switch (type) {
    case 'warning': return 'warning';
    case 'error':   return 'error';
    case 'success': return 'success';
    case 'info':    return 'info';
    default:        return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':   return 'error';
    case 'medium': return 'warning';
    case 'low':    return 'info';
    default:       return 'default';
  }
};

export const AlertsPanel = () => {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            System Alerts
          </Typography>

          <Chip 
            label={alerts.filter(a => a.priority === 'high').length}
            color={getPriorityColor('high')}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Alerts List */}
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {alerts.map((alert) => (
            <ListItem
              key={alert.id}
              sx={{
                px: 0,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box
                  sx={{
                    color: `${getAlertColor(alert.type)}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getAlertIcon(alert.type)}
                </Box>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    {alert.title}
                    <Chip
                      label={alert.priority}
                      color={getPriorityColor(alert.priority)}
                      size="small"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    {alert.message}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {alert.time}
                    </Typography>
                  </Box>
                }
                primaryTypographyProps={{
                  component: 'div',
                  variant: 'body2',
                  sx: { fontWeight: 600 }
                }}
                secondaryTypographyProps={{
                  component: 'div',
                  variant: 'body2',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          ))}
        </List>

      </CardContent>
    </Card>
  );
};
