// src/dashboard/components/charts/volume/data.ts
import { VolumeData } from "./types";

export const volumeData: VolumeData = {
    weekTotal: 627,
    previousWeekTotal: 577,
    averageTrend: 8,
    days: [
        { day: "Seg", current: 85, previous: 78, trend: 9 },
        { day: "Ter", current: 92, previous: 88, trend: 5 },
        { day: "Qua", current: 76, previous: 82, trend: -7 },
        { day: "Qui", current: 103, previous: 95, trend: 8 },
        { day: "Sex", current: 118, previous: 102, trend: 16 },
        { day: "Sáb", current: 89, previous: 74, trend: 20 },
        { day: "Dom", current: 64, previous: 58, trend: 10 },
    ],
};
