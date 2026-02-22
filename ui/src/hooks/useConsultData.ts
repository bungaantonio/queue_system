// src/hooks/useConsultData.ts
import { useQueueStream } from "../app/providers/QueueStreamProvider";

export default function useConsultData(ticketId: string | null) {
  const { nextUsers, calledUser, currentUser, timer } = useQueueStream();
  const normalizeTicket = (value: string | null | undefined) =>
    (value ?? "").trim().toUpperCase();
  const normalizedTicket = normalizeTicket(ticketId);

  // 1. Verifica se o ticket foi o chamado agora
  const isCalled = normalizeTicket(calledUser?.ticket) === normalizedTicket;

  // 2. Verifica se já está sendo atendido (opcional: redirecionar ou mostrar status)
  const isBeingServed =
    normalizeTicket(currentUser?.ticket) === normalizedTicket;

  // 3. Calcula a posição na fila de espera
  // Encontramos o índice do ticket na lista de próximos
  const waitingIndex = nextUsers.findIndex(
    (u) => normalizeTicket(u?.ticket) === normalizedTicket,
  );
  const position = waitingIndex + 1;
  const waitingUser = waitingIndex >= 0 ? nextUsers[waitingIndex] : null;
  const ticketExists = Boolean(isCalled || isBeingServed || waitingUser);
  const isInvalidLookup = normalizedTicket.length > 0 && !ticketExists;
  const slaMinutes =
    timer?.sla_seconds && timer.sla_seconds > 0
      ? Math.round(timer.sla_seconds / 60)
      : null;

  return {
    user: isCalled ? calledUser : isBeingServed ? currentUser : waitingUser,
    position: position > 0 ? position : null,
    isCalled,
    isBeingServed,
    ticketExists,
    isInvalidLookup,
    totalWaiting: nextUsers.length,
    slaMinutes,
  };
}
