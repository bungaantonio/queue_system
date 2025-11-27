// components/charts/waitTime/WaitTimeBar.tsx

import { Box, Typography } from '@mui/material';

interface Props {
    hour: string;
    time: number;
    heightPercent: number;
}

export const WaitTimeBar = ({ hour, time, heightPercent }: Props) => {
    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mx: 0.5,
                height: '100%',
            }}
        >
            {/* Bar */}
            <Box
                aria-label={`${hour}: ${time} minutes`}
                sx={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    minHeight: 24,
                    background: theme =>
                        `linear-gradient(to top, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.25s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        background: theme =>
                            `linear-gradient(to top, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    },
                }}
            />

            {/* Hour */}
            <Typography
                variant="caption"
                sx={{
                    mt: 0.5,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                }}
            >
                {hour}
            </Typography>

            {/* Value */}
            <Typography
                variant="caption"
                sx={{
                    fontSize: '0.65rem',
                    color: 'text.secondary',
                }}
            >
                {time}min
            </Typography>
        </Box>
    );
};
