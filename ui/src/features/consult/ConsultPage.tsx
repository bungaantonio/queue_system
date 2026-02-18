// src/features/ConsultPage.tsx
// Fazer a implementação correta da página de consulta,
// com estados de "Aguardando", "Chamada Ativa" e "Em Atendimento".
// Responder também os utentes que não estão na fila ou que consultam um ticket inválido.
import { motion as Motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import useConsultData from "../../hooks/useConsultData";

export default function ConsultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketId = searchParams.get("ticket") || "";
  const [inputValue, setInputValue] = useState(ticketId);

  const { position, isCalled, isBeingServed, totalWaiting } =
    useConsultData(ticketId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) setSearchParams({ ticket: inputValue.toUpperCase() });
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Header: Rigor Corporativo */}
      <header className="w-full p-4 sm:p-6 bg-white border-b border-slate-200 flex justify-between items-center flex-none">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Sistema de Filas
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
            Terminal Móvel
          </h1>
        </div>
        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
          <svg
            className="w-5 h-5 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 3.89 2.36 7.22 5.707 8.568L9.75 18.9l.453-.182a11.95 11.95 0 005.707-8.568c0-1.284-.202-2.52-.577-3.682A11.959 11.959 0 0112 2.714z"
            />
          </svg>
        </div>
      </header>

      <main className="min-h-0 flex-1 w-full max-w-md mx-auto space-y-6 p-4 overflow-y-auto overflow-x-hidden overscroll-contain">
        {/* Formulário de Consulta Manual: Tira o aspeto estático */}
        <section className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            Consultar Novo Ticket
          </p>
          <form onSubmit={handleSearch} className="relative flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Exemplo: LA033"
              className="flex-1 min-w-0 w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 font-black text-lg uppercase tracking-wider focus:border-indigo-600 focus:outline-none transition-all"
            />
            <button className="bg-slate-900 text-white px-6 rounded-2xl font-black uppercase text-xs hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
              Consultar
            </button>
          </form>
        </section>

        <AnimatePresence mode="wait">
          {!ticketId ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]"
            >
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                Utilize o formulário acima para consultar o seu ticket
              </p>
            </Motion.div>
          ) : isCalled ? (
            /* ESTADO: CHAMADO (Match com o Overlay da TV) */
            <Motion.div
              key="called"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-indigo-600 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl shadow-indigo-200 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10 space-y-6">
                <span className="bg-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Atenção
                </span>
                <h2 className="text-white text-6xl sm:text-7xl font-black tracking-tighter leading-none">
                  {ticketId}
                </h2>
                <div className="bg-white rounded-3xl p-6 shadow-xl">
                  <p className="text-indigo-900/40 text-[10px] font-black uppercase mb-1">
                    Dirija-se ao
                  </p>
                  <p className="text-indigo-600 text-4xl font-black uppercase tracking-tighter">
                    Balcão 01
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-indigo-100">
                  <svg
                    className="w-5 h-5 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
                    />
                  </svg>
                  <span className="text-xs font-black uppercase tracking-widest">
                    Chamada em curso
                  </span>
                </div>
              </div>
            </Motion.div>
          ) : isBeingServed ? (
            /* ESTADO: EM ATENDIMENTO */
            <Motion.div
              key="served"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-500 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] text-white text-center shadow-xl border-4 border-emerald-400"
            >
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                Atendimento em curso
              </h2>
              <div className="h-1 w-20 bg-white/30 mx-auto my-4 rounded-full" />
              <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest opacity-80">
                Ticket: {ticketId}
              </p>
            </Motion.div>
          ) : (
            /* ESTADO: AGUARDANDO (Match com o Relógio do Rodapé) */
            <Motion.div
              key="waiting"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent" />
              <div className="relative text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-4">
                  Acompanhe a sua posição na fila
                </span>
                <div className="flex items-center justify-center">
                  <span className="text-7xl sm:text-[10rem] font-black text-white leading-none tracking-tighter tabular-nums">
                    {position ?? "-"}
                  </span>
                </div>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Ainda existem utentes à sua frente
                  </p>
                </div>
              </div>
            </Motion.div>

          )}
        </AnimatePresence>

        {/* Info Box: Instrução sem Emojis */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex gap-5">
          <div className="flex-none w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-xs uppercase tracking-tight">
              Monitorização Ativa
            </h4>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              Esta página atualiza automaticamente. Não é necessário atualizar manualmente.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Fixo: Estatísticas Reais */}
      <footer className="px-4 sm:px-8 py-4 sm:py-6 bg-white border-t border-slate-200 flex-none">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Fila Geral
            </span>
            <span className="text-xl font-black text-slate-900">
              {totalWaiting}{" "}
              <span className="text-xs text-slate-400 uppercase">Utentes</span>
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Tempo Médio
            </span>
            <span className="text-xl font-black text-indigo-600">
              ~12 <span className="text-xs text-indigo-300 uppercase">Min</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
