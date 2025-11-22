export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  beep?: HTMLAudioElement | null;
}

export function announceTTS(
  text: string,
  { lang = "pt-BR", rate = 1, pitch = 1, beep = null }: TTSOptions = {}
): void {
  if ("speechSynthesis" in window) {
    // Cancela qualquer fala anterior
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const playTTS = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    };

    if (beep instanceof Audio) {
      // toca bip antes do TTS
      beep.play().finally(playTTS);
    } else {
      playTTS();
    }
  } else {
    console.warn("SpeechSynthesis não suportado neste navegador.");
  }
}
