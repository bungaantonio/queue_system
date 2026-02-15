// src/dashboard/components/volume/types.ts

export interface DayVolume {
  day: string; // ex.: "Mon"
  current: number; // volume actual
  previous: number; // volume da semana anterior
  trend: number; // número positivo ou negativo
}

export interface VolumeData {
  weekTotal: number;
  previousWeekTotal: number;
  averageTrend: number;
  days: DayVolume[];
}
