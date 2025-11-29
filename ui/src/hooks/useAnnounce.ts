import { useEffect, useRef } from "react";
import { announceSequence } from "../services/announcementService";
import { formatSenhaForSpeech } from "../utils/formatSenha";
import { isAudioAllowed } from "../utils/audioPermission";

interface User {
  id: string | number;
  id_hint?: string;
}

interface Options {
  repetitions?: number;
  interval?: number;
}

export function useAnnounce(
  calledUser: User | null,
  { repetitions = 3, interval = 10000 }: Options = {}
) {
  const lastAnnouncedId = useRef<string | number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    console.log("[useAnnounce] chamada detectada:", calledUser, "audioAllowed:", isAudioAllowed());

    // cancela timers antigos
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (!isAudioAllowed()) {
      console.log("[useAnnounce] Áudio não permitido ainda.");
      return;
    }

    if (!calledUser?.id_hint) {
      console.log("[useAnnounce] Nenhum usuário chamado.");
      return;
    }

    if (lastAnnouncedId.current === calledUser.id) {
      console.log("[useAnnounce] Usuário já anunciado:", calledUser.id);
      return;
    }

    const senha = formatSenhaForSpeech(calledUser.id_hint);
    const text = `Senha ${senha}, por favor dirigir-se ao atendimento.`;

    console.log("[useAnnounce] Preparando anúncios:", text);

    for (let i = 0; i < repetitions; i++) {
      const t = setTimeout(() => {
        console.log(`[useAnnounce] Disparando anúncio ${i + 1}/${repetitions}`);
        announceSequence(text);
      }, i * interval);
      timers.current.push(t);
    }

    lastAnnouncedId.current = calledUser.id;

    return () => timers.current.forEach(clearTimeout);
  }, [calledUser, repetitions, interval]);

}
