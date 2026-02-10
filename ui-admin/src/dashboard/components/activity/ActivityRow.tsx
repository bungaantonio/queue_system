// ActivityRow.tsx
import { TableCell, TableRow, Box, Avatar, Typography, Chip } from '@mui/material';
import { Activity, ActivityAction, ActivityStatus } from './types';
import { getStatusColor, getActionIcon } from './activityIcons';
import { ACTIVITY_ACTION_LABELS } from './labels';

interface ActivityRowProps {
    activity: Activity;
}

export const ActivityRow = ({ activity }: ActivityRowProps) => {
    // Chave de cor segura para theme.palette
    const paletteKey = getStatusColor(activity.status);

    return (
        <TableRow
            sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                '& td': { borderBottom: '1px solid', borderColor: 'divider', py: 2 },
            }}
        >
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: 'primary.main',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            mr: 1.5,
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

            <TableCell>
                <Chip
                    label={ACTIVITY_ACTION_LABELS[activity.action]}
                    size="small"
                    icon={getActionIcon(activity.action)}
                    sx={(theme) => ({
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        bgcolor: theme.palette[paletteKey].main,
                        color: theme.palette[paletteKey].contrastText,
                    })}
                />
            </TableCell>

            <TableCell>
                <Typography variant="body2" color="text.secondary">
                    {activity.time}
                </Typography>
            </TableCell>
        </TableRow>
    );
};
