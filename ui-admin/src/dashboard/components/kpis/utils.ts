import { Trend } from './types';

export const colorMap = {
    primary: { bg: '#EBF8FF', text: '#1E40AF', border: '#BFDBFE' },
    secondary: { bg: '#F1F5F9', text: '#64748B', border: '#CBD5E1' },
    success: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
    warning: { bg: '#FFFBEB', text: '#D97706', border: '#FCD34D' },
    error: { bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
    info: { bg: '#EFF6FF', text: '#0284C7', border: '#93C5FD' },
};

export const getTrendColor = (isPositive?: boolean) => {
    if (isPositive === undefined) return 'text.primary';
    return isPositive ? 'success.main' : 'error.main';
};

export const formatTrend = (value?: number, isPositive?: boolean) => {
    if (value === undefined) return '';
    return `${isPositive && value > 0 ? '+' : ''}${value}%`;
};
