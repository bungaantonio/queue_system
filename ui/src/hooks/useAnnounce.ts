// src/hooks/useAnnounce.ts
import { useEffect, useRef } from "react";
import { announcementService } from "../services/announcementService";
import { isAudioAllowed } from "../utils/audioPermission";
import { formatTicketForSpeech } from "../utils/formatTicketSpeech";
import { CONFIG } from "../app/config";

interface User {
  id: number;
  short_name: string;
  ticket: string;
}

interface Options {
  repetitions?: number;
  interval?: number;
  deskLabel?: string;
}

export function useAnnounce(
  calledUser: User | null,
  { repetitions = 1, interval = 10000, deskLabel = "Guichê 1" }: Options = {},
) {
  const lastAnnouncedId = useRef<number | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!calledUser) return;

    // Evita anúncio inesperado no refresh (snapshot inicial do SSE).
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      lastAnnouncedId.current = calledUser.id;
      return;
    }

    if (!isAudioAllowed()) return;
    if (lastAnnouncedId.current === calledUser.id) return;

    const spokenTicket = formatTicketForSpeech(calledUser.ticket);
    const fallbackText = `${spokenTicket}. ${calledUser.short_name}. ${deskLabel}.`;
    const audioUrl =
      `${CONFIG.API_BASE_URL}/audio/ticket/${calledUser.id}` +
      `?last_digits=${encodeURIComponent(calledUser.ticket)}`;

    const timers: number[] = [];

    for (let i = 0; i < repetitions; i++) {
      const timer = window.setTimeout(() => {
        announcementService.enqueue({
          type: "FILE",
          content: audioUrl,
          fallbackText,
          delayAfterBeep: 250,
        });
      }, i * interval);
      timers.push(timer);
    }

    lastAnnouncedId.current = calledUser.id;

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [calledUser?.id, repetitions, interval, deskLabel]);
}
