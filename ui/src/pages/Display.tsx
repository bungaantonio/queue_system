import { useMemo } from "react";
import useQueueData from "../hooks/useQueueData";
import { useAnnounce } from "../hooks/useAnnounce";
import VideoPlayer from "../components/VideoPlayer";
import CurrentUser from "../components/CurrentUser";
import CalledUser from "../components/CalledUser";
import NextUsers from "../components/NextUsers";
import Timer from "../components/Timer";
import QrCodeBox from "../components/QrCodeBox";
import Clock from "../components/Clock";

export default function Display() {
  const { currentUser, calledUser, nextUsers } = useQueueData();

  // Cria o bipe sonoro
  const beep = useMemo(
    () => new Audio("/sounds/simple-notification-152054.mp3"),
    []
  );

  // Anuncia o usuário chamado
  useAnnounce(calledUser, {
    repetitions: 3,
    interval: 10000,
    beep,
    lang: "pt-BR",
    rate: 1,
    pitch: 1,
  });

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen lg:h-screen gap-6 px-4 py-6 bg-gradient-to-br from-white via-sky-50 to-amber-50 text-slate-900 lg:gap-8 lg:px-8 lg:py-10">
      {/* Área do vídeo (sempre visível, flexível em mobile) */}
      <div className="flex-[2] flex flex-col gap-6 min-h-[200px] lg:min-h-0">
        <VideoPlayer />
      </div>

      {/* Aside com scroll interno e altura adaptável */}
      <aside
        className="flex-[1] flex flex-col gap-6 rounded-[36px] border border-sky-200/80 bg-white/90 p-6 shadow-[0_40px_80px_-48px_rgba(14,116,144,0.5)] backdrop-blur-xl
        max-h-[80vh] lg:max-h-full overflow-y-auto"
      >
        {/* Chamado agora */}
        {!currentUser && <CalledUser user={calledUser} />}

        {/* Current User + Timer */}
        <div className="grid grid-cols-1 gap-5">
          {currentUser && (
            <CurrentUser user={{ ...currentUser, name: currentUser.name }} />
          )}

          <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-100/70 via-white to-sky-100/70 p-6 shadow-[0_18px_40px_-24px_rgba(234,88,12,0.4)]">
            <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>Tempo em atendimento</span>
              <span className="text-[0.78rem] font-semibold text-slate-600">
                Atualiza automaticamente
              </span>
            </div>
            <Timer keyProp={currentUser?.id} />
          </div>
        </div>

        {/* Próximos usuários com scroll interno se necessário */}
        <div className="overflow-y-auto max-h-[30vh] lg:max-h-none">
          <NextUsers users={nextUsers || []} />
        </div>

        {/* QR + Clock */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          <QrCodeBox />
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-white/90 p-6 text-center shadow-[0_16px_34px_-26px_rgba(14,165,233,0.6)]">
            <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
              Horário atual
            </span>
            <Clock />
            <span className="text-sm text-slate-600">
              Atualização em tempo real
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
