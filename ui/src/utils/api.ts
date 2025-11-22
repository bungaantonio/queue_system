import { QueueState } from "../types/queue";

type SSECallback = (data: QueueState) => void;

export function subscribeQueueUpdates(onMessage: SSECallback) {
  let evtSource: EventSource;

  const connect = () => {
    evtSource = new EventSource("http://127.0.0.1:8000/api/v1/sse/stream");

    evtSource.onmessage = (event: MessageEvent) => {
      try {
        const data: QueueState = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("[Queue SSE] Erro ao processar SSE:", err);
      }
    };

    evtSource.onopen = () => console.log("[Queue SSE] Conexão aberta ✅");

    evtSource.onerror = () => {
      console.error("[Queue SSE] Conexão perdida, tentando reconectar...");
      evtSource.close();
      setTimeout(connect, 3000);
    };
  };

  connect();

  return {
    close: () => evtSource.close(),
  };
}
