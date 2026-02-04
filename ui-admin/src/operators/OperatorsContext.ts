import { createContext, useContext } from "react";
import type { Operator } from "../modules/operators/types";

export interface OperatorsContextType {
  operators: Operator[];
  loading: boolean;
  loadingActions: Record<number, boolean>;
  create: (operator: Omit<Operator, "id">) => Promise<void>;
  update: (id: number, operator: Partial<Operator>) => Promise<void>;
  delete: (id: number) => Promise<void>;
  reload: () => Promise<void>;
}

export const OperatorsContext = createContext<OperatorsContextType | null>(
  null,
);

export const useOperators = (): OperatorsContextType => {
  const ctx = useContext(OperatorsContext);
  if (!ctx)
    throw new Error("useOperators deve ser usado dentro de OperatorsProvider");
  return ctx;
};
