// src/services/beepManager.ts
import {
  isAutoplayBlockedError,
  notifyAudioBlocked,
} from "../utils/audioPermission";

class BeepManager {
  private beepAudio: HTMLAudioElement | null = null;
  private static readonly BEEP_TIMEOUT_MS = 5000;

  initBeep(src: string = "/sounds/notification.mp3") {
    if (!this.beepAudio) {
      this.beepAudio = new Audio(src);
      this.beepAudio.volume = 0.5;
      this.beepAudio.preload = "auto";
    }
  }

  async warmup(): Promise<void> {
    if (!this.beepAudio) this.initBeep();
    if (!this.beepAudio) return;
    try {
      this.beepAudio.muted = true;
      this.beepAudio.currentTime = 0;
      await this.beepAudio.play();
      this.beepAudio.pause();
      this.beepAudio.currentTime = 0;
    } catch {
      // noop
    } finally {
      this.beepAudio.muted = false;
    }
  }

  async playBeep(): Promise<void> {
    if (!this.beepAudio) this.initBeep();
    if (!this.beepAudio) return;

    console.log("[beepManager] Tocar beep...");
    return new Promise((resolve) => {
      const audio = this.beepAudio!;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeoutId);
        audio.onended = null;
        audio.onerror = null;
        resolve();
      };

      const timeoutId = window.setTimeout(() => {
        console.warn("[beepManager] Timeout do beep, seguindo fluxo.");
        finish();
      }, BeepManager.BEEP_TIMEOUT_MS);

      audio.onended = () => {
        console.log("[beepManager] Beep finalizado.");
        finish();
      };
      audio.onerror = () => {
        console.warn("[beepManager] Falha no beep, seguindo fluxo.");
        finish();
      };

      audio.currentTime = 0;
      audio.play().catch((err) => {
        if (isAutoplayBlockedError(err)) notifyAudioBlocked();
        finish();
      });
    });
  }
}

export const beepManager = new BeepManager();
