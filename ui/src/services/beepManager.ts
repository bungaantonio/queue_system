// src/services/beepManager.ts
class BeepManager {
  private beepAudio: HTMLAudioElement | null = null;

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
      this.beepAudio!.onended = () => {
        console.log("[beepManager] Beep finalizado.");
        resolve();
      };
      this.beepAudio!.currentTime = 0;
      this.beepAudio!.play().catch(() => resolve());
    });
  }
}

export const beepManager = new BeepManager();
