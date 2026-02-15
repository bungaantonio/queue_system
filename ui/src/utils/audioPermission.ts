// src/utils/audioPermission.ts
let audioUnlocked = false;
const AUDIO_PERMISSION_KEY = "queue.audio.unlocked";

export async function requestAudioPermission(): Promise<boolean> {
  if (audioUnlocked) return true;

  // Não bloqueia o fluxo da UI: considera desbloqueado após gesto do utilizador.
  audioUnlocked = true;
  try {
    sessionStorage.setItem(AUDIO_PERMISSION_KEY, "1");
  } catch {}

  try {
    speechSynthesis.getVoices();
    const utter = new SpeechSynthesisUtterance("Áudio ativado");
    utter.volume = 0.6;
    speechSynthesis.speak(utter);
    const a = new Audio();
    a.volume = 0.0;
    await a.play().catch(() => undefined);
  } catch {}

  return true;
}

export function resetAudioPermission(): void {
  audioUnlocked = false;
  try {
    sessionStorage.removeItem(AUDIO_PERMISSION_KEY);
  } catch {}
}

export function isAudioAllowed(): boolean {
  return audioUnlocked;
}
