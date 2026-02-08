import { QueueState } from "../../domain/queue/queue.types";

type SSECallback = (data: QueueState) => void;

export class QueueStream {
  private evtSource?: EventSource;
  private url: string;
  private onMessage: SSECallback;
  private reconnectTimeout: number = 3000;

  constructor(url: string, onMessage: SSECallback) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    console.log(`[Queue SSE] Tentando conectar em: ${this.url}`);
    this.evtSource = new EventSource(this.url);

    // Ouvindo o evento específico definido no Backend
    this.evtSource.addEventListener("queue_sync", (event) => {
      try {
        const data: QueueState = JSON.parse(event.data);
        console.log("[Queue SSE] Dados recebidos:", data);

        // Executa o callback que atualiza o Context do React
        this.onMessage(data);
      } catch (err) {
        // Se cair aqui, pode ser JSON inválido ou erro dentro do Provider
        console.error(
          "[Queue SSE] Erro ao processar mensagem ou callback:",
          err,
        );
      }
    });

    this.evtSource.onopen = () => {
      console.log("[Queue SSE] Conexão aberta ✅");
    };

    this.evtSource.onerror = (err) => {
      console.error("[Queue SSE] Erro de conexão. Reconectando em 3s...", err);
      this.evtSource?.close();

      // Tenta reconectar automaticamente
      setTimeout(() => this.connect(), this.reconnectTimeout);
    };
  }

  public close() {
    console.log("[Queue SSE] Encerrando conexão...");
    this.evtSource?.close();
  }
}
