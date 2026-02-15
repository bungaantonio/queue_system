// src/pages/Display.tsx
import VideoPlayer from "../components/VideoPlayer";
import QrCodeBox from "../components/QrCodeBox";
import Clock from "../components/Clock";
import AudioOnboarding from "../components/AudioOnboarding";
import MarqueeTicker from "../components/MarqueeTicker";
import PendingValidationCard from "../features/called-user/PendingValidationCard.tsx";
import useQueueData from "../features/called-user/useQueueData";
import QueuePreviewCard from "../features/waiting-list/QueuePreviewCard.tsx";
import ActiveUserCard from "../features/timer/ActiveUserCard.tsx";
import CallOverlay from "../features/called-user/CallOverlay";

export default function Display() {
  useQueueData();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <AudioOnboarding />
      <CallOverlay />

      {/* Grid de Conteúdo Principal */}
      <main className="flex-1 grid min-h-0 grid-cols-12 gap-4 p-4">
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
        <aside className="col-span-4 flex min-h-0 flex-col gap-4">
          <PendingValidationCard />

          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-5 shadow-xl">
            <div className="flex min-h-0 flex-1 flex-col justify-center">
              <ActiveUserCard />
            </div>
          </div>

          <div className="h-[30%] min-h-[150px] flex-none">
            <QueuePreviewCard reduced />
          </div>
        </aside>
      </main>

      {/* Rodapé Corporativo de Alta Visibilidade */}
      <footer className="h-32 bg-white border-t-4 border-slate-100 px-12 flex items-center justify-between shadow-[0_-10px_50px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-12">
          {/* Bloco do Terminal - Foco Total na Identificação */}
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
              Local
            </span>
            <div className="flex items-center gap-5 bg-indigo-600 px-8 py-4 rounded-[2rem] shadow-lg shadow-indigo-200">
              <svg
                className="w-8 h-8 text-indigo-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <p className="text-4xl font-black text-white tracking-tighter uppercase">
                Guichê 01
              </p>
            </div>
          </div>

          {/* Divisor vertical robusto */}
          <div className="h-16 w-1 bg-slate-100 rounded-full" />

          {/* Bloco do Relógio - Otimizado para leitura rápida */}
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              Horário Local
            </span>
            <div className="flex items-center bg-slate-900 px-8 py-4 rounded-[2rem] shadow-xl border-b-4 border-indigo-500">
              {/* O componente Clock deve ter o tamanho text-5xl aqui dentro */}
              <div className="text-5xl font-black text-white tabular-nums tracking-tighter">
                <Clock />
              </div>
              <div className="ml-4 flex flex-col border-l border-white/20 pl-4">
                <span className="text-xs font-black text-indigo-400 uppercase">
                  Fev
                </span>
                <span className="text-xl font-black text-white leading-none">
                  14
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Acompanhamento (QR Code) - Coeso com o resto */}
        <div className="flex items-center gap-8 bg-slate-50 p-4 pr-10 rounded-[2.5rem] border-2 border-slate-100">
          <div className="relative">
            <QrCodeBox reduced />
            {/* Decoração estática, sem pisco-pisco */}
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-slate-900 font-black text-xl uppercase tracking-tighter leading-none mb-1">
              Acompanhe a fila
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              No seu smartphone
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
