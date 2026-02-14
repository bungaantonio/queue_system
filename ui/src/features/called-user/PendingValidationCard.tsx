// src/features/called-user/PendingValidationCard.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function PendingValidationCard() {
  const { calledUser: user } = useQueueStream();

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!user ? (
          <Motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-6 text-center"
          >
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Aguardando Chamada
            </p>
          </Motion.div>
        ) : (
          <Motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-6 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                      Senha Chamada
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                    {user.short_name}
                  </h2>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                    />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] p-6 text-center shadow-xl">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] block mb-1">
                  Ticket
                </span>
                <span className="text-7xl font-black text-slate-900 leading-none tabular-nums tracking-tighter">
                  {user.ticket}
                </span>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}