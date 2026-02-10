// components/charts/waitTime/utils.ts

import { WaitTimePoint } from './types';

export const getMaxTime = (data: WaitTimePoint[]) =>
    Math.max(...data.map(d => d.time));

export const getMinTime = (data: WaitTimePoint[]) =>
    Math.min(...data.map(d => d.time));

export const getRange = (data: WaitTimePoint[]) =>
    getMaxTime(data) - getMinTime(data);

export const getHeightPercent = (time: number, min: number, range: number) => {
    if (range === 0) return 50; // evita barra invisível
    return ((time - min) / range) * 80 + 10; // padding visual
};
