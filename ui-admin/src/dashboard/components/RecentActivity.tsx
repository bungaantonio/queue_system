import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip } from '@mui/material';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  MoreVertical
} from 'lucide-react';

const activities = [
  {
    id: 1,
    user: 'John Smith',
    action: 'Completed',
    details: 'Queue position 5 served successfully',
    time: '2 min ago',
    status: 'success',
    avatar: 'JS',
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    action: 'Cancelled',
    details: 'Left queue voluntarily',
    time: '5 min ago',
    status: 'error',
    avatar: 'SJ',
  },
  {
    id: 3,
    user: 'Mike Wilson',
    action: 'Called',
    details: 'Notified for position 3',
    time: '8 min ago',
    status: 'info',
    avatar: 'MW',
  },
  {
    id: 4,
    user: 'Emma Davis',
    action: 'Completed',
    details: 'Queue position 2 served successfully',
    time: '12 min ago',
    status: 'success',
    avatar: 'ED',
  },
  {
    id: 5,
    user: 'Alex Brown',
    action: 'Skipped',
    details: 'No response after 3 attempts',
    time: '15 min ago',
    status: 'warning',
    avatar: 'AB',
  },
  {
    id: 6,
    user: 'Lisa Garcia',
    action: 'Called',
    details: 'Notified for position 6',
    time: '18 min ago',
    status: 'info',
    avatar: 'LG',
  },
  {
    id: 7,
    user: 'David Lee',
    action: 'Completed',
    details: 'Queue position 1 served successfully',
    time: '22 min ago',
    status: 'success',
    avatar: 'DL',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle size={16} />;
    case 'error':
      return <XCircle size={16} />;
    case 'info':
      return <Clock size={16} />;
    case 'warning':
      return <Clock size={16} />;
    default:
      return <Clock size={16} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'Completed':
      return <CheckCircle size={16} />;
    case 'Cancelled':
      return <XCircle size={16} />;
    case 'Called':
      return <Clock size={16} />;
    case 'Skipped':
      return <XCircle size={16} />;
    default:
      return <Clock size={16} />;
  }
};

export const RecentActivity = () => {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 1, 
              backgroundColor: 'secondary.50', 
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1
            }}
          >
            <Clock size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Activity
          </Typography>
        </Box>
        
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
              {activities.map((activity) => (
                <TableRow 
                  key={activity.id} 
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    '& td': { borderBottom: '1px solid', borderColor: 'divider', py: 2 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.main',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          mr: 1.5
                        }}
                      >
                        {activity.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.user}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.details}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip 
                      label={activity.action} 
                      color={getStatusColor(activity.status)}
                      size="small"
                      icon={getActionIcon(activity.action)}
                      sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};
