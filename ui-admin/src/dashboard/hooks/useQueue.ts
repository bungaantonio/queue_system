// src/dashboard/hooks/useQueue.ts
import { useEffect, useState } from "react";
import { queueDataProvider } from "../data/queueDataProvider";

export const useQueue = () => {
    const [queue, setQueue] = useState<any[]>([]);
    const [current, setCurrent] = useState<any | null>(null);
    const [called, setCalled] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    // SSE streaming
    useEffect(() => {
        const evtSource = new EventSource("http://127.0.0.1:8000/api/v1/sse/stream");

        evtSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setQueue(data.queue || []);
            setCurrent(data.current || null);
            setCalled(data.called || null);
            setLoading(false);
        };

        evtSource.onerror = (err) => {
            console.error("SSE error:", err);
            evtSource.close();
        };

        return () => evtSource.close();
    }, []);

    // ações da fila
    const callNext = async () => {
        try {
            await queueDataProvider.callNext();
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const finish = async () => {
        try {
            await queueDataProvider.finish();
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const cancel = async (userId: number) => {
        try {
            await queueDataProvider.cancel(userId);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const requeue = async (userId: number, attendanceType: string, operatorId: number) => {
        try {
            await queueDataProvider.requeue(userId, attendanceType, operatorId);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const skip = async () => {
        try {
            await queueDataProvider.skip();
        } catch (err: any) {
            console.error(err.message);
        }
    };

    return { queue, current, called, loading, callNext, finish, cancel, requeue, skip };
};
