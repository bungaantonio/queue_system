// activityIcons.tsx
import { ReactElement } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { ActivityStatus, ActivityAction } from './types';

// Status colors: agora tipado como literal do MUI palette
export const STATUS_COLORS: Record<ActivityStatus, 'success' | 'error' | 'info' | 'warning'> = {
  success: 'success',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

// Retorna a chave do theme.palette
export const getStatusColor = (status: ActivityStatus): 'success' | 'error' | 'info' | 'warning' =>
  STATUS_COLORS[status];

// Ações → ícones
export const ACTION_ICONS: Record<ActivityAction, ReactElement> = {
  Completed: <CheckCircle size={16} />,
  Cancelled: <XCircle size={16} />,
  Called: <Clock size={16} />,
  Skipped: <XCircle size={16} />,
};

export const getActionIcon = (action: ActivityAction): ReactElement =>
  ACTION_ICONS[action] ?? <Clock size={16} />;
