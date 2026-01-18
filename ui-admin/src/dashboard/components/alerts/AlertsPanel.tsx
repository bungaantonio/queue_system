// AlertsPanel.tsx
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AlertsList } from './AlertsList';
import { AlertData, AlertPriority } from './alertTypes';
import { Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { ALERT_PRIORITY_LABELS } from './labels';

const alerts: AlertData[] = [
  { id: 1, type: 'warning', title: 'Fila acima do limite', message: 'Comprimento atual da fila (18) excede o limite de 15', time: 'há 5 min', priority: 'high', icon: <Users size={20} className="text-amber-500" /> },
  { id: 2, type: 'error', title: 'Violação de SLA', message: '3 utilizadores ultrapassaram o tempo máximo de espera', time: 'há 12 min', priority: 'high', icon: <Clock size={20} className="text-red-500" /> },
  { id: 3, type: 'warning', title: 'Inatividade do operador', message: 'Sem respostas do operador #2 durante 15 minutos', time: 'há 18 min', priority: 'medium', icon: <AlertTriangle size={20} className="text-amber-500" /> },
  { id: 4, type: 'success', title: 'Objetivo de desempenho atingido', message: 'Meta diária de SLA alcançada (94,2%)', time: 'há 1 hora', priority: 'low', icon: <CheckCircle size={20} className="text-emerald-500" /> },
  { id: 5, type: 'info', title: 'Manutenção do sistema', message: 'Janela de manutenção agendada: 02:00 - 04:00', time: 'há 2 horas', priority: 'low', icon: <Info size={20} className="text-blue-500" /> },
];

const priorityOrder: AlertPriority[] = ['high', 'medium', 'low'];
const priorityColors: Record<AlertPriority, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export const AlertsPanel = () => {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Alertas do Sistema</Typography>
          <Chip
            label={alerts.filter(a => a.priority === 'high').length}
            color="error"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Lista de alertas por prioridade */}
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          {priorityOrder.map((priority: AlertPriority) => {
            const group = alerts.filter(a => a.priority === priority);
            if (!group.length) return null;

            return (
              <Box key={priority} sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textTransform: 'uppercase',
                    color:
                      priority === 'high'
                        ? 'error.main'
                        : priority === 'medium'
                          ? 'warning.main'
                          : 'info.main',
                  }}
                >
                  {ALERT_PRIORITY_LABELS[priority]}
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
