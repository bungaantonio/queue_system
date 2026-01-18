import { Trend } from './types';

export const colorMap = {
    primary: { bg: '#EBF8FF', text: '#1E40AF' },
    secondary: { bg: '#F1F5F9', text: '#64748B' },
    success: { bg: '#ECFDF5', text: '#059669' },
    warning: { bg: '#FFFBEB', text: '#D97706' },
    error: { bg: '#FEF2F2', text: '#DC2626' },
    info: { bg: '#EFF6FF', text: '#0284C7' },
} as const;

export const getTrendColor = (isPositive?: boolean) => {
    if (isPositive === undefined) return 'text.primary';
    return isPositive ? 'success.main' : 'error.main';
};

export const formatTrend = (value?: number, isPositive?: boolean) => {
    if (value === undefined) return '';
    return `${isPositive && value > 0 ? '+' : ''}${value}%`;
};
