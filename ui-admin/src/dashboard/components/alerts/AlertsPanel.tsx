// components/alerts/AlertsPanel.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AlertsList } from './AlertsList';
import { AlertData, AlertPriority } from './alertTypes';
import { Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const alerts: AlertData[] = [
  { id: 1, type: 'warning', title: 'Queue Above Threshold', message: 'Current queue length (18) exceeds threshold of 15', time: '5 min ago', priority: 'high', icon: <Users size={20} className="text-amber-500" /> },
  { id: 2, type: 'error', title: 'SLA Breach Detected', message: '3 users have exceeded acceptable wait time', time: '12 min ago', priority: 'high', icon: <Clock size={20} className="text-red-500" /> },
  { id: 3, type: 'warning', title: 'Operator Inactivity', message: 'No responses from operator #2 for 15 minutes', time: '18 min ago', priority: 'medium', icon: <AlertTriangle size={20} className="text-amber-500" /> },
  { id: 4, type: 'success', title: 'Performance Target Met', message: 'Daily SLA compliance target achieved (94.2%)', time: '1 hour ago', priority: 'low', icon: <CheckCircle size={20} className="text-emerald-500" /> },
  { id: 5, type: 'info', title: 'System Maintenance', message: 'Scheduled maintenance window: 02:00 - 04:00 AM', time: '2 hours ago', priority: 'low', icon: <Info size={20} className="text-blue-500" /> },
];

const priorityOrder: AlertPriority[] = ['high', 'medium', 'low'];

export const AlertsPanel = () => {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>System Alerts</Typography>
          <Chip
            label={alerts.filter(a => a.priority === 'high').length}
            color="error"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Scrollable alert groups */}
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {priorityOrder.map(priority => {
            const group = alerts.filter(a => a.priority === priority);
            if (!group.length) return null;

            return (
              <Box key={priority} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, textTransform: 'uppercase', color: priority === 'high' ? 'error.main' : priority === 'medium' ? 'warning.main' : 'info.main' }}>
                  {priority} priority
                </Typography>
                <AlertsList alerts={group} />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
