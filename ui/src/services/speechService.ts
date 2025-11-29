interface SpeechOptions {
    lang?: string;
    rate?: number;
    pitch?: number;
}

class SpeechService {
    speak(
        text: string,
        { lang = "pt-PT", rate = 0.95, pitch = 1 }: SpeechOptions = {}
    ): Promise<void> {
        return new Promise(resolve => {
            if (!("speechSynthesis" in window)) return resolve();

            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = lang;
            utter.rate = rate;
            utter.pitch = pitch;

            // escolher voz PT nativa se disponível
            const voices = speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang.startsWith("pt-PT"));
            if (ptVoice) utter.voice = ptVoice;

            utter.onend = () => resolve();

            speechSynthesis.cancel();
            speechSynthesis.speak(utter);
        });
    }
}

export const speechService = new SpeechService();
