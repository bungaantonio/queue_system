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
  timestamp?: string;
}

interface Options {
  repetitions?: number;
  interval?: number;
  deskLabel?: string;
  scheduleMs?: number[];
}

const STRICT_MODE_DEDUPE_WINDOW_MS = 1200;
let lastGlobalAnnounce: { key: string; at: number } | null = null;

export function useAnnounce(
  calledUser: User | null,
  {
    repetitions = 1,
    interval = 10000,
    deskLabel = "Guichê 1",
    scheduleMs,
  }: Options = {},
) {
  const lastAnnouncedKey = useRef<string | null>(null);
  const scheduleKey = scheduleMs?.join(",") ?? "";
  const announceKey = calledUser
    ? `${calledUser.id}|${calledUser.ticket}|${calledUser.timestamp ?? ""}`
    : "";

  useEffect(() => {
    if (!calledUser) return;
    if (!isAudioAllowed()) return;
    if (lastAnnouncedKey.current === announceKey) return;

    // Evita disparo duplo em desenvolvimento (StrictMode).
    const now = Date.now();
    if (
      lastGlobalAnnounce &&
      lastGlobalAnnounce.key === announceKey &&
      now - lastGlobalAnnounce.at < STRICT_MODE_DEDUPE_WINDOW_MS
    ) {
      lastAnnouncedKey.current = announceKey;
      return;
    }

    const spokenTicket = formatTicketForSpeech(calledUser.ticket);
    const fallbackText = `${spokenTicket}. ${calledUser.short_name}. ${deskLabel}.`;
    const audioUrl =
      `${CONFIG.API_BASE_URL}/audio/ticket/${calledUser.id}` +
      `?last_digits=${encodeURIComponent(calledUser.ticket)}`;
    const offsets =
      scheduleMs && scheduleMs.length > 0
        ? scheduleMs
        : Array.from({ length: repetitions }, (_, i) => i * interval);

    announcementService.clearQueue();
    const timers: number[] = [];

    for (const offset of offsets) {
      const timer = window.setTimeout(() => {
        announcementService.enqueue({
          type: "FILE",
          content: audioUrl,
          fallbackText,
          delayAfterBeep: 250,
        });
      }, offset);
      timers.push(timer);
    }

    lastAnnouncedKey.current = announceKey;
    lastGlobalAnnounce = { key: announceKey, at: now };

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [announceKey, calledUser?.id, repetitions, interval, deskLabel, scheduleKey]);
}
