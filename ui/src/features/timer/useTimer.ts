// src/features/timer/useTimer.ts
import { useEffect, useState } from "react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function useTimer() {
  const { timer } = useQueueStream();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!timer || !timer.current_user) {
      setElapsed(0);
      return;
    }

    // Sincroniza com o valor inicial do servidor
    setElapsed(timer.elapsed_seconds);

    // Incrementa localmente para o display ser fluido (60fps)
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer?.current_user?.id, timer?.elapsed_seconds]);

  return {
    currentUser: timer?.current_user ?? null,
    // Garante que o SLA seja pelo menos 1 para evitar divisão por zero no gráfico
    slaSeconds:
      timer?.sla_seconds && timer.sla_seconds > 0 ? timer.sla_seconds : 600,
    elapsed,
    status: timer?.status ?? "Pendente",
  };
}
