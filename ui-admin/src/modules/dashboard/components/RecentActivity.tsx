// RecentActivity.tsx
import { useState } from 'react';
import { Card, CardContent, Typography, Box, Table, TableCell, TableBody, TableHead, TableRow, Button, Stack } from '@mui/material';
import { Clock } from 'lucide-react';
import { Activity } from './types';
import { ActivityRow } from './ActivityRow';

// Exemplo de atividades recentes (podes substituir por dados reais)
const activities: Activity[] = [
  { id: 1, user: 'John Smith', action: 'Completed', details: 'Posição 5 atendida com sucesso', time: 'há 2 min', status: 'success', avatar: 'JS' },
  { id: 2, user: 'Sarah Johnson', action: 'Cancelled', details: 'Saiu da fila voluntariamente', time: 'há 5 min', status: 'error', avatar: 'SJ' },
  { id: 3, user: 'Mike Wilson', action: 'Called', details: 'Notificado para a posição 3', time: 'há 8 min', status: 'info', avatar: 'MW' },
  { id: 4, user: 'Emma Davis', action: 'Completed', details: 'Posição 2 atendida com sucesso', time: 'há 12 min', status: 'success', avatar: 'ED' },
  { id: 5, user: 'Alex Brown', action: 'Skipped', details: 'Sem resposta após 3 tentativas', time: 'há 15 min', status: 'warning', avatar: 'AB' },
  { id: 6, user: 'Lisa Garcia', action: 'Called', details: 'Notificado para a posição 6', time: 'há 18 min', status: 'info', avatar: 'LG' },
  { id: 7, user: 'David Lee', action: 'Completed', details: 'Posição 1 atendida com sucesso', time: 'há 22 min', status: 'success', avatar: 'DL' },
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

        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'secondary.50', color: 'secondary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
            <Clock size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Atividades Recentes</Typography>
        </Box>

        {/* Filtros de status */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {statusFilters.map(f => {
            const count = f === 'all' ? activities.length : countByStatus(f as Activity['status']);
            const color = f === 'all' ? 'primary' : statusColors[f as Activity['status']];
            const label = f === 'all' ? 'Todos'
              : f === 'success' ? 'Concluídos'
                : f === 'error' ? 'Cancelados'
                  : f === 'warning' ? 'Ignorados'
                    : 'Chamados';
            return (
              <Button
                key={f}
                variant={filter === f ? 'contained' : 'outlined'}
                size="small"
                color={color}
                onClick={() => setFilter(f as 'all' | Activity['status'])}
              >
                {label} ({count})
              </Button>
            );
          })}
        </Stack>

        {/* Tabela de atividades */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Table sx={{ minWidth: 300 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid', borderColor: 'divider' } }}>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>Utilizador</TableCell>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>Ação</TableCell>
                <TableCell sx={{ py: 2, fontWeight: 600 }}>Hora</TableCell>
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
