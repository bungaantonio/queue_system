// src/services/audioPlayer.ts
export async function playAudioFile(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        console.log("[audioPlayer] Criando elemento de áudio:", url);

        audio.onended = () => {
            console.log("[audioPlayer] Áudio finalizado:", url);
            resolve();
        };

        audio.onerror = (ev) => {
            console.error("[audioPlayer] Erro ao reproduzir áudio:", url, ev);
            resolve(); // resolve mesmo em erro, para não travar a fila
        };

        // autoplay é permitido porque o clique de ativação desbloqueou o áudio
        audio.play().catch((err) => {
            console.error("[audioPlayer] Falha ao iniciar reprodução:", url, err);
            resolve();
        });
    });
}
