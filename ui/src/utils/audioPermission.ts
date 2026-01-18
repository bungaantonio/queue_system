// src/utils/audioPermission.ts
let audioUnlocked = false;

export function requestAudioPermission(): void {
  if (audioUnlocked) return;
  try {
    speechSynthesis.getVoices();
    const utter = new SpeechSynthesisUtterance("Áudio ativado");
    utter.volume = 0.6;
    speechSynthesis.speak(utter);
    const a = new Audio();
    a.volume = 0.0;
    a.play().catch(() => { });
  } catch { }
  audioUnlocked = true;
}

export function isAudioAllowed(): boolean {
  return audioUnlocked;
}
