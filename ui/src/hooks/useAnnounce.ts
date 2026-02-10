// src/hooks/useAnnounce.ts
import { useEffect, useRef } from "react";
import { announceSequence } from "../services/announcementService";
import { isAudioAllowed } from "../utils/audioPermission";

interface User {
  id: number;
  name: string;
  id_hint?: string;
}

interface Options {
  repetitions?: number;
  interval?: number;
}

export function useAnnounce(calledUser: User | null, { repetitions = 1, interval = 10000 }: Options = {}) {
  const lastAnnouncedId = useRef<number | null>(null);

  useEffect(() => {
    if (!isAudioAllowed() || !calledUser) return;
    if (lastAnnouncedId.current === calledUser.id) return;

    const audioUrl = `http://localhost:8000/api/v1/audio/senha/${calledUser.id}?last_digits=${calledUser.id_hint}`;
    for (let i = 0; i < repetitions; i++) {
      setTimeout(() => announceSequence(audioUrl), i * interval);
    }

    lastAnnouncedId.current = calledUser.id;
  }, [calledUser, repetitions, interval]);
}
