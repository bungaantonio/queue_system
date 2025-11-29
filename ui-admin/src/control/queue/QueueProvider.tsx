// src/control/queue/QueueProvider.tsx
import { useEffect, useState } from "react";
import { QueueContext } from "./QueueContext";
import type { QueueUser } from "./types";
import { queueDataProvider } from "../data/queueDataProvider";

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
    const [queue, setQueue] = useState<QueueUser[]>([]);
    const [called, setCalled] = useState<QueueUser[]>([]);
    const [current, setCurrent] = useState<QueueUser | null>(null);
    const [loading, setLoading] = useState(true);

    // loading global para ações da fila (callNext, skip e finish)
    const [loadingGlobalAction, setLoadingGlobalAction] = useState(false);

    // loading individual por utilizador para ações: cancel, requeue
    const [loadingActions, setLoadingActions] = useState<Record<number, boolean>>({});

    const setUserLoading = (id: number, value: boolean) => {
        setLoadingActions(prev => ({ ...prev, [id]: value }));
    };

    // SSE
    useEffect(() => {
        let evt: EventSource;

        const connect = () => {
            evt = new EventSource("/api/v1/sse/stream");

            evt.onmessage = (ev) => {
                const data = JSON.parse(ev.data);
                const calledArray = Array.isArray(data.called)
                    ? data.called
                    : data.called
                        ? [data.called]
                        : [];

                setQueue(data.queue || []);
                setCalled(calledArray);
                setCurrent(data.current || null);
                setLoading(false);
            };

            evt.onerror = () => {
                console.error("SSE lost. Reconnecting in 2s...");
                evt.close();
                setTimeout(connect, 2000);
            };
        };

        connect();
        return () => evt?.close();
    }, []);

    // =====================
    // Ações globais (callNext, skip, finish)
    // =====================
    const callNext = async () => {
        setLoadingGlobalAction(true);
        await queueDataProvider.callNext();
        setLoadingGlobalAction(false);
    };

    const skip = async () => {
        setLoadingGlobalAction(true);
        await queueDataProvider.skip();
        setLoadingGlobalAction(false);
    };

    const finish = async () => {
        setLoadingGlobalAction(true);
        await queueDataProvider.finish(); // backend finaliza o current
        setLoadingGlobalAction(false);
    };

    // =====================
    // Ações individuais (cancel, requeue)
    // =====================
    const cancel = async (id: number) => {
        console.log("Cancelando userId:", id);
        setUserLoading(id, true);
        try {
            const res = await queueDataProvider.cancel(id);
            console.log("Cancel response:", res);
        } finally {
            setUserLoading(id, false);
        }
    };


    const requeue = async (id: number, type: string) => {
        console.log("Reagendando userId:", id, "type:", type);
        setUserLoading(id, true);
        try {
            const res = await queueDataProvider.requeue(id, type);
            console.log("Requeue response:", res);
        } finally {
            setUserLoading(id, false);
        }
    };


    return (
        <QueueContext.Provider
            value={{
                queue,
                called,
                current,
                loading,
                loadingAction: loadingGlobalAction,
                loadingActions,
                callNext,
                finish,
                cancel,
                requeue,
                skip,
            }}
        >
            {children}
        </QueueContext.Provider>
    );
};
