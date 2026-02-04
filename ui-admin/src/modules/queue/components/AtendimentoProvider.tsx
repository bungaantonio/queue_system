import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { atendimentoGateway } from "../atendimentoGateway";

// 1. Definição da Interface para o TypeScript não reclamar
interface AtendimentoContextType {
  queue: any[];
  called: any | null;
  current: any | null;
  loading: boolean;
  callNext: () => Promise<void>;
  finish: () => Promise<void>;
  cancel: (id: number) => Promise<void>;
  requeue: (id: number, type: string) => Promise<void>;
  skip: () => Promise<void>;
}

// 2. Criação do contexto ÚNICO
export const AtendimentoContext = createContext<AtendimentoContextType | null>(
  null,
);

export const AtendimentoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [called, setCalled] = useState<any>(null);
  const [current, setCurrent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Função para atualizar o estado vindo do servidor
  const updateState = useCallback((data: any) => {
    console.log("AtendimentoProvider: Atualizando estado", data);
    if (data && typeof data === "object" && !Array.isArray(data)) {
      setQueue(data.queue || []);
      setCalled(data.called || null);
      setCurrent(data.current || null);
    } else if (Array.isArray(data)) {
      setQueue(data);
    }
    setLoading(false);
  }, []);

  // Funções de Ação
  const callNext = async () => {
    await atendimentoGateway.callNext();
  };
  const finish = async () => {
    await atendimentoGateway.finish();
  };
  const skip = async () => {
    await atendimentoGateway.skip();
  };
  const cancel = async (id: number) => {
    await atendimentoGateway.cancel(id);
  };
  const requeue = async (id: number, type: string) => {
    await atendimentoGateway.requeue(id, type);
  };

  useEffect(() => {
    // Carga inicial HTTP
    atendimentoGateway
      .listWaitingAndCalled()
      .then(updateState)
      .catch(() => setLoading(false));

    // Tempo real SSE
    const baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const eventSource = new EventSource(`${baseUrl}/api/v1/sse/stream`);

    eventSource.addEventListener("queue_sync", (e: any) => {
      updateState(JSON.parse(e.data));
    });

    return () => eventSource.close();
  }, [updateState]);

  return (
    <AtendimentoContext.Provider
      value={{
        queue,
        called,
        current,
        loading,
        callNext,
        finish,
        cancel,
        requeue,
        skip,
      }}
    >
      {children}
    </AtendimentoContext.Provider>
  );
};
