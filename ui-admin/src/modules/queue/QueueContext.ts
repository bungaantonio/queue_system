import { createContext } from "react";
import type { QueueUser } from "./atendimento.types";

interface AtendimentoContextType {
  queue: QueueUser[];
  called: QueueUser[];
  current: QueueUser | null;
  loading: boolean;
  loadingAction: boolean;
  loadingActions: Record<number, boolean>;
  callNext: () => Promise<void>;
  finish: () => Promise<void>;
  cancel: (id: number) => Promise<void>;
  requeue: (id: number, type: string) => Promise<void>;
  skip: () => Promise<void>;
}

export const AtendimentoContext = createContext<AtendimentoContextType>({
  queue: [],
  called: [],
  current: null,
  loading: true,
  loadingAction: false,
  loadingActions: {},
  callNext: async () => {},
  finish: async () => {},
  cancel: async () => {},
  requeue: async () => {},
  skip: async () => {},
});
