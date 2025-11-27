// components/charts/sla/utils.ts

import { SLAMetric, SLAStatus } from './types';

export const getStatusColor = (status: SLAStatus): string => {
    switch (status) {
        case 'success': return 'success.main';
        case 'warning': return 'warning.main';
        case 'error': return 'error.main';
        default: return 'text.primary';
    }
};

export const getStatusBg = (status: SLAStatus): string => {
    switch (status) {
        case 'success': return 'success.50';
        case 'warning': return 'warning.50';
        case 'error': return 'error.50';
        default: return 'grey.50';
    }
};

export const calculateOverallSLA = (metrics: SLAMetric[]): number => {
    const values = metrics.map(m => m.current);
    const total = values.reduce((acc, v) => acc + v, 0);
    return parseFloat((total / values.length).toFixed(1));
};
