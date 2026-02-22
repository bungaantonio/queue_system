// src/services/audioPlayer.ts
import {
  isAutoplayBlockedError,
  notifyAudioBlocked,
} from "../utils/audioPermission";

export async function playAudioFile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.preload = "auto";
    const timeoutMs = 12000;
    let finished = false;
    console.log("[audioPlayer] Criando elemento de áudio:", url);

    const finalize = (success: boolean) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeoutId);
      audio.onended = null;
      audio.onerror = null;
      resolve(success);
    };

    const timeoutId = window.setTimeout(() => {
      console.warn("[audioPlayer] Timeout ao reproduzir áudio:", url);
      finalize(false);
    }, timeoutMs);

    audio.onended = () => {
      console.log("[audioPlayer] Áudio finalizado:", url);
      finalize(true);
    };

    audio.onerror = (ev) => {
      console.error("[audioPlayer] Erro ao reproduzir áudio:", url, ev);
      finalize(false);
    };

    audio.play().catch((err) => {
      console.error("[audioPlayer] Falha ao iniciar reprodução:", url, err);
      if (isAutoplayBlockedError(err)) notifyAudioBlocked();
      finalize(false);
    });
  });
}
