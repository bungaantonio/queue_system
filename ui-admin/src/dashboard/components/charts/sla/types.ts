// components/charts/sla/types.ts

export type SLAStatus = "success" | "warning" | "error";

export interface SLAMetric {
  label: string;
  current: number;
  target: number;
  status: SLAStatus;
}
