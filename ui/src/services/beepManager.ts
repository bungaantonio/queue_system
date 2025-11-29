// src/services/beepManager.ts
class BeepManager {
    private beepAudio: HTMLAudioElement | null = null;

    initBeep(src: string = "/sounds/notification.mp3") {
        if (!this.beepAudio) {
            this.beepAudio = new Audio(src);
            this.beepAudio.volume = 0.5;
        }
    }

    async playBeep(): Promise<void> {
        if (!this.beepAudio) return;
        console.log("[beepManager] Tocar beep...");
        return new Promise((resolve) => {
            this.beepAudio!.onended = () => {
                console.log("[beepManager] Beep finalizado.");
                resolve();
            };
            this.beepAudio!.play().catch(() => resolve());
        });
    }
}

export const beepManager = new BeepManager();
