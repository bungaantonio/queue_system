import { ListItem, ListItemIcon, ListItemText, Chip, Box } from '@mui/material';
import { AlertData } from './alertTypes';

const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'info'
} as const;

interface Props {
    alert: AlertData;
}

export const AlertItem = ({ alert }: Props) => {
    return (
        <ListItem
            sx={{
                px: 0,
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' }
            }}
        >
            <ListItemIcon sx={{ minWidth: 40 }}>
                {alert.icon}
            </ListItemIcon>

            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        {alert.title}
                        <Chip
                            label={alert.priority}
                            color={priorityColors[alert.priority]}
                            size="small"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                        />
                    </Box>
                }
                secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {alert.message}
                        <Box sx={{ fontSize: '0.75rem', opacity: 0.7 }}>
                            {alert.time}
                        </Box>
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
    );
};
