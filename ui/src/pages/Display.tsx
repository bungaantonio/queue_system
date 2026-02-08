// src/pages/Display.tsx
import { useState, useEffect } from "react";
import useQueueData from "../features/called-user/useQueueData";
import VideoPlayer from "../components/VideoPlayer";
import CalledUser from "../features/called-user/CalledUser";
import NextUsers from "../features/waiting-list/NextUsers";
import Timer from "../components/Timer";
import QrCodeBox from "../components/QrCodeBox";
import Clock from "../components/Clock";
import MarqueeTicker from "../components/MarqueeTicker";
import CallOverlay from "../features/called-user/CallOverlay";
import AudioOnboarding from "../components/AudioOnboarding";

export default function Display() {
  const { currentUser, calledUser, nextUsers } = useQueueData();
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (calledUser?.id) {
      setShowOverlay(true);
      const timer = setTimeout(() => setShowOverlay(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [calledUser?.id]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <AudioOnboarding />
      <CallOverlay user={showOverlay ? calledUser : null} />

      {/* Grid de Conteúdo Principal */}
      <main className="flex-1 grid grid-cols-12 gap-6 p-6 min-h-0">
        {/* Esquerda: Vídeo + Notícias */}
        <section className="col-span-8 flex flex-col rounded-[2.5rem] bg-black shadow-2xl overflow-hidden border border-slate-200">
          <div className="flex-1 relative min-h-0">
            <VideoPlayer />
          </div>
          <div className="h-14 flex items-center bg-slate-900">
            <MarqueeTicker />
          </div>
        </section>

        {/* Direita: Painel de Informações */}
        <aside className="col-span-4 flex flex-col gap-6 min-h-0">
          <CalledUser user={calledUser} />

          {/* Container do Meio: Timer */}
          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-none">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 mb-1">
                  Status
                </span>
                <h4 className="text-lg font-black text-slate-800 tracking-tighter uppercase leading-none">
                  Em Atendimento
                </h4>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase">
                  Live
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center min-h-0">
              <Timer keyProp={currentUser?.id} />
            </div>
          </div>

          {/* Próximos na Fila */}
          <div className="flex-none h-[32%]">
            <NextUsers users={nextUsers} reduced />
          </div>
        </aside>
      </main>

      {/* Rodapé Corporativo Integrado */}
      <footer className="h-24 bg-white border-t border-slate-200 px-12 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-12">
          {/* Relógio */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2 leading-none">
              Horário Local
            </span>
            <div className="bg-slate-900 px-5 py-2.5 rounded-2xl shadow-lg border border-slate-700">
              <Clock reduced />
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200" />

          {/* Identificação do Terminal */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1 leading-none">
              Terminal Atual
            </span>
            <p className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              Guichê 01
            </p>
          </div>
        </div>

        {/* CHAMADA PARA O QR CODE (Integrado Perfeitamente) */}
        <div className="flex items-center gap-6 bg-amber-50/50 p-3 pr-6 rounded-[2rem] border border-amber-100/80 shadow-sm">
          <QrCodeBox reduced />
          <div className="flex flex-col">
            {/* O texto aqui pode ser amber-900 para manter a cor quente, 
        mas o QR Code sendo Slate-900 traz a seriedade técnica necessária */}
            <p className="text-amber-900 font-black text-xs uppercase leading-none mb-1.5">
              Acompanhe pelo celular
            </p>
            <p className="text-amber-800/60 text-[9px] font-bold uppercase tracking-widest leading-none">
              Acesso rápido via QR Code
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
