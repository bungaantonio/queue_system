import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { QueueUser, QueueState } from "../../domain/queue/queue.types";
import { QueueStream } from "../../core/stream/sseClient";

interface QueueContextValue {
  currentUser: QueueUser | null;
  calledUser: QueueUser | null;
  nextUsers: QueueUser[];
}

const QueueContext = createContext<QueueContextValue | undefined>(undefined);

export function QueueStreamProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<QueueUser | null>(null);
  const [calledUser, setCalledUser] = useState<QueueUser | null>(null);
  const [nextUsers, setNextUsers] = useState<QueueUser[]>([]);

  useEffect(() => {
    // Usando o IP configurado para a sua rede
    const stream = new QueueStream(
      "http://192.168.18.7:8000/api/v1/sse/stream",
      (data: QueueState) => {
        // 1. Defesa: Se os dados forem nulos ou malformados, ignoramos para não quebrar o estado
        if (!data) return;

        // 2. Atualização dos estados principais
        setCurrentUser(data.current ?? null);
        setCalledUser(data.called ?? null);

        // 3. Filtro inteligente da fila de espera
        // - Garantimos que 'queue' é um array antes de filtrar
        // - Removemos quem já está no 'called' ou no 'current' para evitar duplicados visualmente
        const rawQueue = data.queue || [];
        const filteredQueue = rawQueue.filter(
          (u) => u.id !== data.called?.id && u.id !== data.current?.id,
        );

        // 4. Pegamos apenas os 3 primeiros para o display
        setNextUsers(filteredQueue.slice(0, 3));
      },
    );

    return () => stream.close();
  }, []);

  return (
    <QueueContext.Provider value={{ currentUser, calledUser, nextUsers }}>
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
