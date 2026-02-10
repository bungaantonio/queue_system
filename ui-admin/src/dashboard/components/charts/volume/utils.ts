// components/charts/volume/utils.ts

import { DayVolume } from './types';

export const getMaxValue = (data: DayVolume[]) =>
    Math.max(...data.map(d => d.current));

export const getTotal = (data: DayVolume[]) =>
    data.reduce((sum, item) => sum + item.current, 0);

export const getAverageTrend = (data: DayVolume[]) =>
    Math.round(data.reduce((sum, item) => sum + item.trend, 0) / data.length);
