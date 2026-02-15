// src/modules/queue/components/AtendimentoProvider.tsx
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { atendimentoGateway } from "../atendimentoGateway";
import { sessionStore } from "../../../core/session/sessionStorage";
import { CONFIG } from "../../../core/config/config";

// 1. Definições de Tipos mais rigorosas para evitar 'any'
interface Utente {
  id: number;
  position: string;
  name: string;
  status: "waiting" | "called_pending" | "being_served";
}

interface AtendimentoContextType {
  queue: Utente[];
  called: Utente | null;
  current: Utente | null;
  loading: boolean;
  callNext: () => Promise<void>;
  finish: () => Promise<void>;
  cancel: (id: number) => Promise<void>;
  requeue: (id: number, type: string) => Promise<void>;
  skip: () => Promise<void>;
}

export const AtendimentoContext = createContext<AtendimentoContextType | null>(
  null,
);

export const AtendimentoProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Utente[]>([]);
  const [called, setCalled] = useState<Utente | null>(null);
  const [current, setCurrent] = useState<Utente | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Função para processar os dados vindos da API ou do SSE.
   * Notei nos teus logs que o backend envia: { success: true, data: { queue, called, current } }
   */
  const updateState = useCallback((response: any) => {
    console.log("AtendimentoProvider: Processando atualização", response);

    // Extrai o objeto de dados (seja da resposta direta ou do campo 'data')
    const payload = response?.data || response;

    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      setQueue(payload.queue || []);
      setCalled(payload.called || null);
      setCurrent(payload.current || null);
    } else if (Array.isArray(payload)) {
      setQueue(payload);
    }

    setLoading(false);
  }, []);

  // Encapsulamento das chamadas ao Gateway
  const callNext = async () => {
    const res = await atendimentoGateway.callNext();
    updateState(res);
  };

  const finish = async () => {
    const res = await atendimentoGateway.finish();
    updateState(res);
  };

  const skip = async () => {
    const res = await atendimentoGateway.skip();
    updateState(res);
  };

  const cancel = async (id: number) => {
    const res = await atendimentoGateway.cancel(id);
    updateState(res);
  };

  const requeue = async (id: number, type: string) => {
    const res = await atendimentoGateway.requeue(id, type);
    updateState(res);
  };

  useEffect(() => {
    let isMounted = true;

    // 1. Carga inicial via HTTP
    atendimentoGateway
      .listWaitingAndCalled()
      .then((res) => {
        if (isMounted) updateState(res);
      })
      .catch((err) => {
        console.error("Erro na carga inicial da fila:", err);
        if (isMounted) setLoading(false);
      });

    // 2. Configuração do SSE para tempo real
    const token = sessionStore.getAccessToken();
    const sseUrl = `${CONFIG.SSE_STREAM_URL}${token ? `?token=${token}` : ""}`;

    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => console.log("✅ SSE conectado:", sseUrl);

    eventSource.onerror = (err) => {
      console.error("❌ SSE erro:", err);
      // O navegador tenta reconectar automaticamente
    };

    // Escuta o evento específico definido no teu backend
    eventSource.addEventListener("queue_sync", (e: any) => {
      try {
        const parsedData = JSON.parse(e.data);
        if (isMounted) updateState(parsedData);
      } catch (err) {
        console.error("Erro ao processar mensagem SSE:", err);
      }
    });

    // Cleanup: Fecha a conexão SSE e marca como desmontado para evitar fugas de memória
    return () => {
      isMounted = false;
      eventSource.close();
      console.log("🔌 SSE desconectado");
    };
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
