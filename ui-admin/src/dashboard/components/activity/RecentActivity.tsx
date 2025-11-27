// RecentActivity.tsx
import { useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableCell, TableBody, TableHead, TableRow, Button, Stack } from '@mui/material';
import { Clock } from 'lucide-react';
import { Activity } from './types';
import { ActivityRow } from './ActivityRow';

const activities: Activity[] = [
  { id: 1, user: 'John Smith', action: 'Completed', details: 'Queue position 5 served successfully', time: '2 min ago', status: 'success', avatar: 'JS' },
  { id: 2, user: 'Sarah Johnson', action: 'Cancelled', details: 'Left queue voluntarily', time: '5 min ago', status: 'error', avatar: 'SJ' },
  { id: 3, user: 'Mike Wilson', action: 'Called', details: 'Notified for position 3', time: '8 min ago', status: 'info', avatar: 'MW' },
  { id: 4, user: 'Emma Davis', action: 'Completed', details: 'Queue position 2 served successfully', time: '12 min ago', status: 'success', avatar: 'ED' },
  { id: 5, user: 'Alex Brown', action: 'Skipped', details: 'No response after 3 attempts', time: '15 min ago', status: 'warning', avatar: 'AB' },
  { id: 6, user: 'Lisa Garcia', action: 'Called', details: 'Notified for position 6', time: '18 min ago', status: 'info', avatar: 'LG' },
  { id: 7, user: 'David Lee', action: 'Completed', details: 'Queue position 1 served successfully', time: '22 min ago', status: 'success', avatar: 'DL' },
];

const statusFilters: ('all' | Activity['status'])[] = ['all', 'success', 'error', 'warning', 'info'];
const statusColors: Record<Activity['status'], 'success' | 'error' | 'warning' | 'info'> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

export const RecentActivity = () => {
  const [filter, setFilter] = useState<'all' | Activity['status']>('all');

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter(a => a.status === filter);

  // Contagem de atividades por status
  const countByStatus = (status: Activity['status']) =>
    activities.filter(a => a.status === status).length;

  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'secondary.50', color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
            <Clock size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Activity</Typography>
        </Box>

        {/* Filtros */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {statusFilters.map(f => {
            const count = f === 'all' ? activities.length : countByStatus(f as Activity['status']);
            const color = f === 'all' ? 'primary' : statusColors[f as Activity['status']];
            return (
              <Button
                key={f}
                variant={filter === f ? 'contained' : 'outlined'}
                size="small"
                color={color}
                onClick={() => setFilter(f as 'all' | Activity['status'])}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
              </Button>
            );
          })}
        </Stack>

        {/* Tabela */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.map(a => (
                <ActivityRow key={a.id} activity={a} />
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};
