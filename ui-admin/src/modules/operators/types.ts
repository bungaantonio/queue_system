// src/modules/operators/types.ts
export type OperatorRole = "admin" | "attendant" | "auditor" | "system";

export interface OperatorApi {
  id: number;
  username: string;
  role: OperatorRole;
  active: boolean;
  created_at?: string | null;
  last_login?: string | null;
  last_activity?: string | null;
}

export interface Operator {
  id: number;
  username: string;
  role: OperatorRole;
  active: boolean;
  createdAt?: string | null;
  lastLogin?: string | null;
  lastActivity?: string | null;
}

export const normalizeOperator = (input: OperatorApi): Operator => ({
  id: input.id,
  username: input.username,
  role: input.role,
  active: input.active,
  createdAt: input.created_at ?? null,
  lastLogin: input.last_login ?? null,
  lastActivity: input.last_activity ?? null,
});
