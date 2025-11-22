import { useEffect, useRef } from "react";
import { announceTTS } from "../utils/announceTTS";
import { formatSenhaForSpeech } from "../utils/formatSenha";

interface User {
  id: string | number;
  id_number?: string;
  name?: string;
}

interface AnnounceOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  repetitions?: number;
  interval?: number; // ms
  beep?: HTMLAudioElement | null;
}

export function useAnnounce(
  currentUser: User | null,
  {
    lang = "pt-BR",
    rate = 1,
    pitch = 1,
    repetitions = 3,
    interval = 10000,
    beep = null,
  }: AnnounceOptions = {}
) {
  const lastAnnouncedId = useRef<string | number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Limpa repetições antigas
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];

    if (currentUser?.id_number && currentUser.id !== lastAnnouncedId.current) {
      const senhaFormatada = formatSenhaForSpeech(currentUser.id_number);
      const texto = `Senha ${senhaFormatada}, por favor dirigir-se ao atendimento.`;

      for (let i = 0; i < repetitions; i++) {
        const t = setTimeout(() => {
          announceTTS(texto, { lang, rate, pitch, beep });
        }, i * interval);
        timeoutRef.current.push(t);
      }

      lastAnnouncedId.current = currentUser.id;
    }

    // cleanup
    return () => {
      timeoutRef.current.forEach(clearTimeout);
    };
  }, [currentUser, lang, rate, pitch, repetitions, interval, beep]);
}
