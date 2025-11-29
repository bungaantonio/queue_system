let audioUnlocked = false;

export function requestAudioPermission(): void {
  if (audioUnlocked) return;

  try {
    // Tentar aquecer voices (Chrome precisa disto às vezes)
    speechSynthesis.getVoices();

    // Fala curta e audível (não volume 0) para garantir user-activation para TTS.
    // Use texto curto em PT — não é "workaround", é a forma suportada pelos browsers.
    const utter = new SpeechSynthesisUtterance("Áudio ativado");
    utter.volume = 0.6;
    speechSynthesis.speak(utter);

    // Cria e toca um áudio silencioso/curto para desbloquear Audio API se necessário.
    // (seja breve; o objectivo é uma reprodução no clique)
    const a = new Audio();
    a.volume = 0.0;
    a.play().catch(() => { /* ignore */ });
  } catch (e) {
    // swallow
  }

  audioUnlocked = true;
}

export function isAudioAllowed(): boolean {
  return audioUnlocked;
}
