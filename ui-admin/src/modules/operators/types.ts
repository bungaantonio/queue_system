// src/operators/types.ts
export type OperatorRole = "admin" | "attendant" | "auditor";

export interface Operator {
  id: number;
  username: string;
  fullName: string;
  role: OperatorRole;
}
