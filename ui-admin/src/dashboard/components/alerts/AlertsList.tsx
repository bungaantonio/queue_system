import { List } from '@mui/material';
import { AlertItem } from './AlertItem';
import { AlertData } from './alertTypes';

interface Props {
  alerts: AlertData[];
}

export const AlertsList = ({ alerts }: Props) => {
  return (
    <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </List>
  );
};
