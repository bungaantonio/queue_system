// src/services/audioPlayer.ts
export async function playAudioFile(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    audio.preload = "auto";
    console.log("[audioPlayer] Criando elemento de áudio:", url);

    audio.onended = () => {
      console.log("[audioPlayer] Áudio finalizado:", url);
      resolve(true);
    };

    audio.onerror = (ev) => {
      console.error("[audioPlayer] Erro ao reproduzir áudio:", url, ev);
      resolve(false);
    };

    audio.play().catch((err) => {
      console.error("[audioPlayer] Falha ao iniciar reprodução:", url, err);
      resolve(false);
    });
  });
}
