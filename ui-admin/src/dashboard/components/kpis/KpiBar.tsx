import { Box } from '@mui/material';
import { KpiCard } from './KpiCard';
import { Kpi } from './types';
import { Users, Phone, UserCheck, Clock, CheckCircle, TrendingUp } from 'lucide-react';

// Dados de exemplo traduzidos para português
const kpiData: Kpi[] = [
    { title: "Utilizadores em Espera", value: 12, subtitle: "na fila", icon: <Users size={24} />, color: 'warning', trend: { value: 8, isPositive: false } },
    { title: "Utilizadores Chamados", value: 3, subtitle: "aguardando resposta", icon: <Phone size={24} />, color: 'info', trend: { value: 25, isPositive: true } },
    { title: "Em Atendimento Agora", value: 1, subtitle: "sessões ativas", icon: <UserCheck size={24} />, color: 'success', trend: { value: 5, isPositive: true } },
    { title: "Tempo Médio de Espera", value: "8,5 min", subtitle: "média de hoje", icon: <Clock size={24} />, color: 'primary', trend: { value: 12, isPositive: false } },
    { title: "Atendimentos Concluídos Hoje", value: 156, subtitle: "sessões atendidas", icon: <CheckCircle size={24} />, color: 'success', trend: { value: 18, isPositive: true } },
    { title: "Cumprimento do SLA", value: "94,2%", subtitle: "acordo de nível de serviço", icon: <TrendingUp size={24} />, color: 'success', trend: { value: 3.1, isPositive: true } },
];

export const KpiBar = () => (
    <Box
        sx={{
            mb: 5,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 3,
        }}
    >
        {kpiData.map((kpi, index) => (
            <KpiCard key={index} {...kpi} />
        ))}
    </Box>
);
