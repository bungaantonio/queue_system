// src/queue/QueueProvider.tsx
import { useEffect, useState } from "react";
import { QueueContext } from "./QueueContext";
import { queueDataProvider } from "./queueDataProvider";
import type { QueueUser } from "./types";

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

  const callNext = async () => {
    if (queue.length === 0 && called.length === 0) {
      console.warn("Fila vazia, nada a chamar.");
      return;
    }
    setLoadingGlobalAction(true);
    try {
      await queueDataProvider.callNext();
    } finally {
      setLoadingGlobalAction(false);
    }
  };

  const skip = async () => {
    setLoadingGlobalAction(true);
    await queueDataProvider.skip();
    setLoadingGlobalAction(false);
  };

  const finish = async () => {
    setLoadingGlobalAction(true);
    await queueDataProvider.finish();
    setLoadingGlobalAction(false);
  };

  const cancel = async (id: number) => {
    setUserLoading(id, true);
    try {
      await queueDataProvider.cancel(id);
    } finally {
      setUserLoading(id, false);
    }
  };

  const requeue = async (id: number, type: string) => {
    setUserLoading(id, true);
    try {
      await queueDataProvider.requeue(id, type);
    } finally {
      setUserLoading(id, false);
    }
  };

  return (
    <QueueContext.Provider
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
    </QueueContext.Provider>
  );
};
