// src/hooks/useConsultData.ts
import { useEffect, useState } from "react";
import { subscribeQueueUpdates } from "../utils/api";
import { QueueState, QueueUser } from "../types/queue";

export default function useConsultData(ticketId: string | null) {
  const [status, setStatus] = useState<{
    position: number;
    user: QueueUser | null;
    isCalled: boolean;
    totalWaiting: number;
  }>({
    position: 0,
    user: null,
    isCalled: false,
    totalWaiting: 0,
  });

  useEffect(() => {
    if (!ticketId) return;

    const unsubscribe = subscribeQueueUpdates((data: QueueState) => {
      // 1. Verifica se o usuário é o que está sendo chamado agora
      const isBeingCalled = data.called?.id_hint === ticketId;

      // 2. Verifica se ele já está em atendimento
      const isCurrent = data.current?.id_hint === ticketId;

      // 3. Calcula a posição na fila (queue)
      const index = data.queue.findIndex((u) => u.id_hint === ticketId);
      const position = index !== -1 ? index + 1 : 0;

      setStatus({
        position,
        user: isBeingCalled
          ? data.called
          : isCurrent
            ? data.current
            : data.queue[index],
        isCalled: isBeingCalled || isCurrent,
        totalWaiting: data.queue.length,
      });
    });

    return () => unsubscribe.close();
  }, [ticketId]);

  return status;
}
