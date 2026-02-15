// src/hooks/useConsultData.ts
import { useQueueStream } from "../app/providers/QueueStreamProvider";

export default function useConsultData(ticketId: string | null) {
  const { nextUsers, calledUser, currentUser } = useQueueStream();

  // 1. Verifica se o ticket foi o chamado agora
  const isCalled = calledUser?.ticket === ticketId;

  // 2. Verifica se já está sendo atendido (opcional: redirecionar ou mostrar status)
  const isBeingServed = currentUser?.ticket === ticketId;

  // 3. Calcula a posição na fila de espera
  // Encontramos o índice do ticket na lista de próximos
  const position = nextUsers.findIndex((u) => u.ticket === ticketId) + 1;

  return {
    user: isCalled ? calledUser : isBeingServed ? currentUser : null,
    position: position > 0 ? position : null,
    isCalled,
    isBeingServed,
    totalWaiting: nextUsers.length,
  };
}
