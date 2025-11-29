import { beepManager } from "./beepManager";
import { speechService } from "./speechService";

interface QueueItem {
    text: string;
    delayAfterBeep: number;
}

class AnnouncementService {
    private queue: QueueItem[] = [];
    private busy = false;

    async announce(text: string, delayAfterBeep = 800): Promise<void> {
        console.log("[AnnouncementService] Adicionando à fila:", text);
        this.queue.push({ text, delayAfterBeep });
        if (!this.busy) this.processQueue();
    }

    private async processQueue() {
        this.busy = true;
        while (this.queue.length) {
            const item = this.queue.shift()!;
            console.log("[AnnouncementService] Tocando beep para:", item.text);
            await beepManager.playBeep();
            console.log("[AnnouncementService] Beep tocado, aguardando delay:", item.delayAfterBeep);
            await new Promise(res => setTimeout(res, item.delayAfterBeep));
            console.log("[AnnouncementService] Iniciando TTS:", item.text);
            await speechService.speak(item.text);
            console.log("[AnnouncementService] TTS finalizado para:", item.text);
        }
        this.busy = false;
        console.log("[AnnouncementService] Fila processada completamente");
    }
}

export const announcementService = new AnnouncementService();

export function announceSequence(text: string, delayAfterBeep?: number) {
    return announcementService.announce(text, delayAfterBeep);
}
