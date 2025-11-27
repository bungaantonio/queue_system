import { Box } from '@mui/material';
import { KpiCard } from './KpiCard';
import { Kpi } from './types';
import { Users, Phone, UserCheck, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const kpiData: Kpi[] = [
    { title: "Users Waiting", value: 12, subtitle: "in queue", icon: <Users size={24} />, color: 'warning', trend: { value: 8, isPositive: false } },
    { title: "Users Called", value: 3, subtitle: "pending response", icon: <Phone size={24} />, color: 'info', trend: { value: 25, isPositive: true } },
    { title: "Being Served Now", value: 1, subtitle: "active sessions", icon: <UserCheck size={24} />, color: 'success', trend: { value: 5, isPositive: true } },
    { title: "Average Wait Time", value: "8.5 min", subtitle: "today's average", icon: <Clock size={24} />, color: 'primary', trend: { value: 12, isPositive: false } },
    { title: "Completed Today", value: 156, subtitle: "attended sessions", icon: <CheckCircle size={24} />, color: 'success', trend: { value: 18, isPositive: true } },
    { title: "SLA Compliance", value: "94.2%", subtitle: "service level agreement", icon: <TrendingUp size={24} />, color: 'success', trend: { value: 3.1, isPositive: true } },
];

export const KpiBar = () => (
    <Box
        sx={{
            mb: 5,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 3, // 3*8px = 24px
        }}
    >
        {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
        ))}
    </Box>
);
