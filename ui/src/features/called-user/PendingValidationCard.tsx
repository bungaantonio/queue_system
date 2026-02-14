// src/features/called-user/CalledUser.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function CalledUser() {
  const { calledUser: user } = useQueueStream();

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!user ? (
          <Motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-[140px] flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-4 text-center"
          >
            <span className="text-2xl grayscale opacity-30">🔔</span>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              Aguardando
            </p>
          </Motion.div>
        ) : (
          <Motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 p-5 shadow-xl shadow-indigo-200"
          >
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-100/80">
                    Chamada
                  </span>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase">
                    {user.short_name}
                  </h2>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <span className="text-xl">☝️</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-inner">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-indigo-900/40">
                    Senha
                  </span>
                  <span className="text-5xl font-black text-indigo-600 leading-none tabular-nums">
                    {user.ticket}
                  </span>
                </div>
                <div className="px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center">
                  <span className="text-[9px] font-black text-indigo-600 uppercase">
                    Guichê 01
                  </span>
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
