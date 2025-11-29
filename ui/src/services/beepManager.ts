class BeepManager {
    private beepAudio: HTMLAudioElement | null = null;

    /**
     * Inicializa beep
     */
    initBeep(src: string = "/sounds/notification.mp3") {
        if (!this.beepAudio) {
            this.beepAudio = new Audio(src);
            this.beepAudio.volume = 0.5;
        }
    }

    /**
     * Toca o beep e aguarda até terminar
     */
    async playBeep(): Promise<void> {
        if (!this.beepAudio) {
            console.log("[beepManager] Nenhum áudio inicializado para beep.");
            return;
        }

        console.log("[beepManager] Tocar beep...");
        return new Promise((resolve) => {
            this.beepAudio!.onended = () => {
                console.log("[beepManager] Beep finalizado.");
                resolve();
            };
            this.beepAudio!.play().catch(() => {
                console.log("[beepManager] Erro ao tocar beep, ignorando...");
                resolve();
            });
        });
    }

}

export const beepManager = new BeepManager();
