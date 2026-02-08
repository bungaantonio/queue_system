// src/components/ConsultPage.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom"; // Opcional, ou pegue via URL nativa
import useConsultData from "../hooks/useConsultData";

export default function ConsultPage() {
  // Simulação: Pega o ticket da URL (ex: ?ticket=LA018)
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get("ticket");

  const { position, user, isCalled, totalWaiting } = useConsultData(ticketId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans text-slate-900">
      {/* Header Mobile */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Sua Fila Digital
          </span>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            Status Live
          </h1>
        </div>
        <div className="h-10 w-10 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-xl">
          👋
        </div>
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col gap-6">
        {/* Card Principal de Status */}
        <AnimatePresence mode="wait">
          {isCalled ? (
            /* VISÃO: QUANDO FOR CHAMADO */
            <Motion.div
              key="called"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-200 text-white text-center"
            >
              <span className="text-xs font-black uppercase tracking-[0.4em] opacity-80">
                É a sua vez!
              </span>
              <h2 className="text-7xl font-black my-4 tracking-tighter">
                {ticketId}
              </h2>
              <p className="text-lg font-medium opacity-90">
                Dirija-se ao Guichê 01
              </p>
              <Motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-6 inline-block bg-white/20 px-6 py-2 rounded-full text-xs font-bold uppercase"
              >
                Chamando Agora
              </Motion.div>
            </Motion.div>
          ) : (
            /* VISÃO: AGUARDANDO NA FILA */
            <Motion.div
              key="waiting"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 text-center relative overflow-hidden"
            >
              <div className="absolute inset-x-0 -top-24 h-48 bg-sky-50 rounded-full blur-3xl opacity-50" />

              <div className="relative">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                  Sua posição atual
                </span>
                <div className="flex items-center justify-center gap-4 my-6">
                  <h2 className="text-8xl font-black text-slate-900 tracking-tighter italic">
                    {position > 0 ? position : "--"}
                  </h2>
                  <span className="text-2xl font-bold text-slate-300">º</span>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-tight">
                    Senha: <span className="text-slate-900">{ticketId}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {totalWaiting} pessoas aguardando no total
                  </p>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Info Card: Dicas */}
        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-xl">🔔</div>
          <div>
            <h4 className="font-black text-amber-900 text-xs uppercase mb-1">
              Dica Importante
            </h4>
            <p className="text-amber-800/70 text-xs leading-relaxed font-medium">
              Não bloqueie a tela do celular. Atualizamos sua posição
              automaticamente a cada segundo.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Mobile */}
      <footer className="w-full max-w-md py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Conexão Segura em Tempo Real
          </span>
        </div>
        <p className="text-[8px] text-slate-300 uppercase font-bold">
          Desenvolvido por Sistema de Gestão de Filas v2.0
        </p>
      </footer>
    </div>
  );
}
