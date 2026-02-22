// app/providers/QueueStreamProvider.tsx
import { CONFIG } from "../config";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { QueueUser, QueueState, Timer } from "../../domain/queue/queue.types";
import { QueueStream } from "../../core/stream/sseClient";

interface QueueContextValue {
  currentUser: QueueUser | null;
  calledUser: QueueUser | null;
  nextUsers: QueueUser[];
  timer: Timer | null;
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

export function QueueStreamProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<QueueUser | null>(null);
  const [calledUser, setCalledUser] = useState<QueueUser | null>(null);
  const [nextUsers, setNextUsers] = useState<QueueUser[]>([]);
  const [timer, setTimer] = useState<Timer | null>(null);

  useEffect(() => {
    // URL centralizada do CONFIG
    const stream = new QueueStream(
      CONFIG.SSE_STREAM_URL,
      (data: QueueState) => {
        const normalizeTicket = (ticket: string | null | undefined) =>
          (ticket ?? "").trim().toUpperCase();
        const sanitizeUser = (user: QueueUser | null | undefined) => {
          if (!user) return null;
          const ticket = normalizeTicket(user.ticket);
          if (!ticket) return null;
          return { ...user, ticket };
        };

        // 1. Defesa: Se os dados forem nulos ou malformados, ignoramos para não quebrar o estado
        if (!data) return;

        const safeCurrent = sanitizeUser(data.current ?? null);
        const safeCalled = sanitizeUser(data.called ?? null);

        // 2. Atualização dos estados principais
        setCurrentUser(safeCurrent);
        setCalledUser(safeCalled);
        setTimer(data.timer ?? null);

        // 3. Filtro inteligente da fila de espera
        // - Garantimos que 'queue' é um array antes de filtrar
        // - Removemos quem já está no 'called' ou no 'current' para evitar duplicados visualmente
        const rawQueue = (data.queue || [])
          .map((u) => sanitizeUser(u))
          .filter((u): u is QueueUser => Boolean(u));
        const filteredQueue = rawQueue.filter(
          (u) => u.id !== safeCalled?.id && u.id !== safeCurrent?.id,
        );

        // 4. Mantemos a fila completa no estado global.
        // A limitação visual (ex.: top 3) é responsabilidade do componente.
        setNextUsers(filteredQueue);
      },
    );

    return () => stream.close();
  }, []);

  return (
    <QueueContext.Provider
      value={{ currentUser, calledUser, nextUsers, timer }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueueStream() {
  const context = useContext(QueueContext);
  if (!context)
    throw new Error("useQueueStream must be used within QueueStreamProvider");
  return context;
}
