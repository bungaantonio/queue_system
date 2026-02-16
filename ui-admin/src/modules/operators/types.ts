// src/operators/types.ts
export type OperatorRole = "admin" | "attendant" | "auditor";

export interface Operator {
  id: number;
  username: string;
  role: OperatorRole;
  active: boolean;
  created_at?: string;
  last_login?: string | null;
  last_activity?: string | null;
}
