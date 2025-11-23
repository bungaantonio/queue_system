import { useEffect, useState } from "react";
import { queueDataProvider } from "../data/queueDataProvider";

export type UserStatus = "WAITING" | "CALLED_PENDING" | "BEING_SERVED" | "DONE" | "CANCELLED";

export interface QueueUser {
    id: number;
    name: string;
    status: UserStatus;
    timestamp: string;
}

export const useQueue = () => {
    const [queue, setQueue] = useState<QueueUser[]>([]);
    const [called, setCalled] = useState<QueueUser[]>([]);
    const [current, setCurrent] = useState<QueueUser | null>(null);
    const [loading, setLoading] = useState(true);

    // SSE streaming
    useEffect(() => {
        const evtSource = new EventSource("http://127.0.0.1:8000/api/v1/sse/stream");

        evtSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            const allQueue: QueueUser[] = data.queue || [];

            setQueue(allQueue.filter(u => u.status === "WAITING"));
            setCalled(allQueue.filter(u => u.status === "CALLED_PENDING"));
            setCurrent(allQueue.find(u => u.status === "BEING_SERVED") || null);
            setLoading(false);
        };

        evtSource.onerror = (err) => {
            console.error("SSE error:", err);
            evtSource.close();
        };

        return () => evtSource.close();
    }, []);

    // Ações da fila
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

    const requeue = async (userId: number, attendanceType: string) => {
        try {
            await queueDataProvider.requeue(userId, attendanceType);
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
