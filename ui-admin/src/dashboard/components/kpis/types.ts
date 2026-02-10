import { ReactNode } from 'react';

export type Trend = {
    value: number;
    isPositive: boolean;
};

export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface Kpi {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: ReactNode;
    trend?: Trend;
    color?: Color;
}
