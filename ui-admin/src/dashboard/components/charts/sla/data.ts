// src/dashboard/components/charts/sla/data.ts
import { SLAMetric } from "./types";

export const slaMetrics: SLAMetric[] = [
    { label: "Tempo de Resposta", current: 94.2, target: 95, status: "warning" },
    { label: "Tempo de Resolução", current: 97.8, target: 98, status: "success" },
    { label: "Resolução ao Primeiro Contacto", current: 91.5, target: 90, status: "success" },
    { label: "Satisfação do Cliente", current: 96.3, target: 95, status: "success" },
];

export const targetSLA = 95;
