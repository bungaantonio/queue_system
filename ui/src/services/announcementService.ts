// src/services/announcementService.ts
import { beepManager } from "./beepManager";
import { playAudioFile } from "./audioPlayer";
import { speechService } from "./speechService";

interface TicketItem {
  type: "FILE" | "SPEECH";
  content: string;
  fallbackText?: string;
  delayAfterBeep?: number;
}

class AnnouncementService {
  private queue: TicketItem[] = [];
  private busy = false;

  enqueue(item: TicketItem) {
    this.queue.push(item);
    if (!this.busy) this.processQueue();
  }

  private async processQueue() {
    this.busy = true;

    while (this.queue.length) {
      const item = this.queue.shift()!;

      await beepManager.playBeep();
      if (item.delayAfterBeep)
        await new Promise((res) => setTimeout(res, item.delayAfterBeep));

      if (item.type === "FILE") {
        const success = await playAudioFile(item.content);
        if (!success && item.fallbackText) {
          await speechService.speak(item.fallbackText);
        }
      } else {
        await speechService.speak(item.content);
      }
    }

    this.busy = false;
  }
}

export const announcementService = new AnnouncementService();
