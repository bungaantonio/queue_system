// src/modules/queue/QueueProvider.tsx
import { useEffect, useState } from "react";
import { AtendimentoContext } from "../QueueContext";
import { atendimentoGateway } from "../atendimentoGateway";
import type { QueueUser } from "../atendimento.types";

export const QueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<QueueUser[]>([]);
  const [called, setCalled] = useState<QueueUser[]>([]);
  const [current, setCurrent] = useState<QueueUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGlobalAction, setLoadingGlobalAction] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Record<number, boolean>>(
    {},
  );

  const setUserLoading = (id: number, value: boolean) => {
    setLoadingActions((prev) => ({ ...prev, [id]: value }));
  };

  // SSE para atualização em tempo real
  useEffect(() => {
    let evt: EventSource;

    const connect = () => {
      evt = new EventSource("/api/v1/sse/stream");
      evt.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        const calledArray = Array.isArray(data.called)
          ? data.called
          : data.called
            ? [data.called]
            : [];
        setQueue(data.queue || []);
        setCalled(calledArray);
        setCurrent(data.current || null);
        setLoading(false);
      };
      evt.onerror = () => {
        evt.close();
        setTimeout(connect, 2000);
      };
    };

    connect();
    return () => evt?.close();
  }, []);

  // Ações do gateway
  const callNext = async () => {
    setLoadingGlobalAction(true);
    try {
      await atendimentoGateway.callNext();
    } finally {
      setLoadingGlobalAction(false);
    }
  };

  const finish = async () => {
    setLoadingGlobalAction(true);
    try {
      await atendimentoGateway.finish();
    } finally {
      setLoadingGlobalAction(false);
    }
  };

  const skip = async () => {
    setLoadingGlobalAction(true);
    try {
      await atendimentoGateway.skip();
    } finally {
      setLoadingGlobalAction(false);
    }
  };

  const cancel = async (id: number) => {
    setUserLoading(id, true);
    try {
      await atendimentoGateway.cancel(id);
    } finally {
      setUserLoading(id, false);
    }
  };

  const requeue = async (id: number, type: string) => {
    setUserLoading(id, true);
    try {
      await atendimentoGateway.requeue(id, type);
    } finally {
      setUserLoading(id, false);
    }
  };

  return (
    <AtendimentoContext.Provider
      value={{
        queue,
        called,
        current,
        loading,
        loadingAction: loadingGlobalAction,
        loadingActions,
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
