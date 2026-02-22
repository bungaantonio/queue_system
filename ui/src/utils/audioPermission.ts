// src/utils/audioPermission.ts
let audioUnlocked = false;
const AUDIO_PERMISSION_KEY = "queue.audio.unlocked";
export const AUDIO_BLOCKED_EVENT = "queue:audio-blocked";

function hasUserActivation(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = (navigator as Navigator & {
    userActivation?: { hasBeenActive?: boolean };
  }).userActivation;
  return ua?.hasBeenActive ?? false;
}

export function isAutoplayBlockedError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    (err as { name?: string }).name === "NotAllowedError"
  );
}

export function notifyAudioBlocked(): void {
  resetAudioPermission();
  window.dispatchEvent(new Event(AUDIO_BLOCKED_EVENT));
}

export async function requestAudioPermission(): Promise<boolean> {
  if (isAudioAllowed()) return true;

  try {
    const a = new Audio("/sounds/notification.mp3");
    a.volume = 0.2;
    a.preload = "auto";
    a.currentTime = 0;
    await a.play();
    a.pause();
    a.currentTime = 0;

    audioUnlocked = true;
    try {
      sessionStorage.setItem(AUDIO_PERMISSION_KEY, "1");
    } catch {}
    return true;
  } catch (err) {
    if (isAutoplayBlockedError(err)) {
      notifyAudioBlocked();
    }
    return false;
  }
}

export function resetAudioPermission(): void {
  audioUnlocked = false;
  try {
    sessionStorage.removeItem(AUDIO_PERMISSION_KEY);
  } catch {}
}

export function isAudioAllowed(): boolean {
  if (audioUnlocked && hasUserActivation()) return true;
  try {
    if (sessionStorage.getItem(AUDIO_PERMISSION_KEY) === "1") {
      if (!hasUserActivation()) return false;
      audioUnlocked = true;
      return true;
    }
  } catch {}
  return false;
}
