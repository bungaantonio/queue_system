// features/timer/useTimer.ts
import { useEffect, useState } from "react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function useTimer() {
    const { timer } = useQueueStream();
    const [elapsed, setElapsed] = useState(timer?.elapsed_seconds ?? 0);

    useEffect(() => {
        if (!timer) return;

        setElapsed(timer.elapsed_seconds);

        const interval = setInterval(() => {
            setElapsed((prev: number): number => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return {
        currentUser: timer?.current_user ?? null,
        slaSeconds: timer?.sla_seconds ?? 0,
        elapsed,
        status: timer?.status ?? "Pendente",
    };
}
