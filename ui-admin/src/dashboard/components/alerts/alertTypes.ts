import { ReactNode } from "react";

export type AlertPriority = "high" | "medium" | "low";
export type AlertType = "warning" | "error" | "success" | "info";

export interface AlertData {
  id: number;
  type: AlertType;
  title: string;
  message: string;
  time: string;
  priority: AlertPriority;
  icon: ReactNode;
}
