// src/features/called-user/PendingValidationCard.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function PendingValidationCard() {
  const { calledUser: user } = useQueueStream();

  return (
    <div className="h-full w-full min-h-0">
      <AnimatePresence mode="wait">
        {!user ? (
          <Motion.div
            key="idle"
            className="h-full min-h-0 flex items-center justify-center bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-[clamp(10px,1vw,16px)] font-black text-slate-300 uppercase tracking-[0.35em]">
              Sistema em Espera
            </span>
          </Motion.div>
        ) : (
          <Motion.div
            key={user.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full min-h-0 rounded-[2.5rem] bg-indigo-600 p-6 xl:p-7 flex flex-col justify-between gap-4 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-56 w-56 xl:h-64 xl:w-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center min-h-0">
              <span className="text-[clamp(9px,0.8vw,12px)] font-black uppercase tracking-[0.35em] text-indigo-200 block mb-2">
                Vez de Atendimento
              </span>
              <h2 className="text-[clamp(46px,5.8vw,108px)] font-black text-white leading-[0.82] tracking-tighter tabular-nums drop-shadow-2xl">
                {user.ticket}
              </h2>
            </div>

            <div className="relative z-10 flex min-h-0 flex-col items-center gap-3">
              <div className="h-1 w-20 bg-white/20 rounded-full" />

              <div className="text-center max-w-full">
                <span className="truncate text-[clamp(18px,1.7vw,32px)] font-bold text-white uppercase tracking-tight block leading-none">
                  {user.short_name}
                </span>
              </div>

              <div className="bg-white text-indigo-700 px-6 py-2.5 rounded-[1.2rem] shadow-xl transform -rotate-1">
                <span className="font-black text-[clamp(10px,0.8vw,13px)] uppercase tracking-[0.15em] block">
                  Siga para o Guichê
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 left-6 right-6 h-1.5 overflow-hidden rounded-full bg-white/15">
              <Motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-full bg-white/40 w-full"
              />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
