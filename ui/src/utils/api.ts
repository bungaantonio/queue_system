import { QueueState } from "../types/queue";

type SSECallback = (data: QueueState) => void;

export function subscribeQueueUpdates(onMessage: SSECallback) {
  let evtSource: EventSource;

  const connect = () => {
    // Se o backend estiver em porta diferente, verifique se o CORS está liberado
    evtSource = new EventSource("http://127.0.0.1:8000/api/v1/sse/stream");

    // 1. Ouvir especificamente o evento "queue_sync" enviado pelo servidor
    evtSource.addEventListener("queue_sync", (event) => {
      try {
        const data: QueueState = JSON.parse(event.data);
        console.log("[Queue SSE] Dados recebidos:", data); // Debug
        onMessage(data);
      } catch (err) {
        console.error("[Queue SSE] Erro ao processar JSON:", err);
      }
    });

    // 2. Opcional: Manter o onmessage para mensagens genéricas (sem nome de evento)
    evtSource.onmessage = (event) => {
      console.log("Mensagem genérica recebida:", event.data);
    };

    evtSource.onopen = () => console.log("[Queue SSE] Conexão aberta ✅");

    evtSource.onerror = (err) => {
      console.error("[Queue SSE] Erro na conexão:", err);
      evtSource.close();
      setTimeout(connect, 3000);
    };
  };

  connect();

  return {
    close: () => {
      if (evtSource) evtSource.close();
    },
  };
}