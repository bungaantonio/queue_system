// src/pages/Display.tsx
import { useMemo, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import CurrentUser from "../components/CurrentUser";
import CalledUser from "../components/CalledUser";
import NextUsers from "../components/NextUsers";
import Timer from "../components/Timer";
import QrCodeBox from "../components/QrCodeBox";
import Clock from "../components/Clock";
import useQueueData from "../hooks/useQueueData";
import { useAnnounce } from "../hooks/useAnnounce";
import { requestAudioPermission, isAudioAllowed } from "../utils/audioPermission";
import { beepManager } from "../services/beepManager";

export default function Display() {
  const { currentUser, calledUser, nextUsers } = useQueueData();

  // Estado para verificar se o usuário ativou áudio/TTS
  const [audioReady, setAudioReady] = useState(isAudioAllowed());

  const handleEnableAudio = () => {
    requestAudioPermission();
    beepManager.initBeep("/sounds/notification.mp3");
    // Toca beep imediato para feedback do clique
    beepManager.playBeep().finally(() => setAudioReady(true));
  };

  // Hook só dispara se audioReady = true
  useAnnounce(audioReady ? calledUser : null, { repetitions: 3, interval: 10000 });


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen gap-6 px-4 py-6 bg-gradient-to-br from-white via-sky-50 to-amber-50 text-slate-900 lg:gap-8 lg:px-8 lg:py-10">

      {/* Botão de ativação de áudio/TTS */}
      {!audioReady && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleEnableAudio}
            className="p-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Ativar Áudio/TTS
          </button>
        </div>
      )}

      {/* Área de vídeo */}
      <div className="flex-[2] flex flex-col gap-6 min-h-[200px] lg:min-h-0">
        <VideoPlayer />
      </div>

      {/* Aside com informações e próximos usuários */}
      <aside className="flex-[1] flex flex-col gap-6 rounded-[36px] border border-sky-200/80 bg-white/90 p-6 shadow-[0_40px_80px_-48px_rgba(14,116,144,0.5)] backdrop-blur-xl max-h-[80vh] lg:max-h-full overflow-y-auto">

        {/* Usuário chamado */}
        {!currentUser && <CalledUser user={calledUser} />}

        {/* Usuário atual + Timer */}
        <div className="grid grid-cols-1 gap-5">
          {currentUser && <CurrentUser user={{ ...currentUser, name: currentUser.name }} />}
          <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-100/70 via-white to-sky-100/70 p-6 shadow-[0_18px_40px_-24px_rgba(234,88,12,0.4)]">
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>Tempo em atendimento</span>
              <span className="text-[0.78rem] font-semibold text-slate-600">Atualiza automaticamente</span>
            </div>
            <Timer keyProp={currentUser?.id} />
          </div>
        </div>

        {/* Próximos usuários */}
        <div className="overflow-y-auto max-h-[30vh] lg:max-h-none">
          <NextUsers users={nextUsers || []} />
        </div>

        {/* QR + Clock */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <QrCodeBox />
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-white/90 p-6 text-center shadow-[0_16px_34px_-26px_rgba(14,165,233,0.6)]">
            <span className="text-xs uppercase tracking-[0.4em] text-slate-500">Horário atual</span>
            <Clock />
            <span className="text-sm text-slate-600">Atualização em tempo real</span>
          </div>
        </div>

      </aside>
    </div>
  );
}
