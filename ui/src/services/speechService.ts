// src/services/speechService.ts
interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

class SpeechService {
  speak(
    text: string,
    { lang = "pt-PT", rate = 0.95, pitch = 1 }: SpeechOptions = {},
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window) || !text?.trim()) return resolve();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = rate;
      utter.pitch = pitch;

      const voices = speechSynthesis.getVoices();
      const ptVoice =
        voices.find((v) => v.lang.startsWith("pt-PT")) ||
        voices.find((v) => v.lang.startsWith("pt-BR")) ||
        voices.find((v) => v.lang.startsWith("pt"));
      if (ptVoice) utter.voice = ptVoice;

      utter.onend = () => resolve();
      utter.onerror = () => resolve();

      speechSynthesis.speak(utter);
    });
  }
}

export const speechService = new SpeechService();
