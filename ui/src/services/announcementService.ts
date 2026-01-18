// src/services/announcementService.ts
import { beepManager } from "./beepManager";
import { playAudioFile } from "./audioPlayer";

interface QueueItem {
    audioUrl: string;
    delayAfterBeep: number;
}

class AnnouncementService {
    private queue: QueueItem[] = [];
    private busy = false;

    enqueue(item: QueueItem) {
        console.log("[AnnouncementService] Adicionando à fila:", item.audioUrl);
        this.queue.push(item);
        if (!this.busy) this.processQueue();
    }

    private async processQueue() {
        this.busy = true;

        while (this.queue.length) {
            const item = this.queue.shift()!;
            await beepManager.playBeep();
            await new Promise(res => setTimeout(res, item.delayAfterBeep));
            await playAudioFile(item.audioUrl);
        }

        this.busy = false;
    }
}

export const announcementService = new AnnouncementService();

// utilitário para hooks
export function announceSequence(audioUrl: string, delayAfterBeep = 800) {
    announcementService.enqueue({ audioUrl, delayAfterBeep });
}
