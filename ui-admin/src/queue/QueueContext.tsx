// src/control/queue/QueueContext.ts
import { createContext, useContext } from "react";
import type { QueueUser } from "../modules/queue/types";

export interface QueueContextType {
    queue: QueueUser[];
    called: QueueUser[];
    current: QueueUser | null;
    loading: boolean;

    // loading global para ações da fila
    loadingAction: boolean;

    // loading individual por userId
    loadingActions?: Record<number, boolean>;

    // ações
    callNext: () => Promise<void>;
    finish: () => Promise<void>;
    cancel: (itemId: number) => Promise<void>;
    requeue: (userId: number, attendance: string) => Promise<void>;
    skip: () => Promise<void>;
}


export const QueueContext = createContext<QueueContextType | null>(null);

export const useQueue = (): QueueContextType => {
    const ctx = useContext(QueueContext);
    if (!ctx) throw new Error("useQueue deve ser usado dentro de QueueProvider");
    return ctx;
};
