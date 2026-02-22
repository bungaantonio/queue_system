// src/features/timer/ActiveUserCard.tsx
import { useEffect, useState } from "react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";
import useTimer from "./useTimer";
import { motion as Motion } from "motion/react";

export default function ActiveUserCard() {
  const { currentUser: user } = useQueueStream();
  const { slaSeconds, elapsed } = useTimer();
  const [localElapsed, setLocalElapsed] = useState(elapsed);

  useEffect(() => {
    if (!user) return;
    setLocalElapsed(elapsed);
    const interval = setInterval(() => setLocalElapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [user?.id, elapsed]);

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-200">
          Balcão Disponível para Atendimento
        </span>
      </div>
    );
  }

  const isOverdue = localElapsed >= slaSeconds;
  const progress = Math.min((localElapsed / slaSeconds) * 100, 100);
  const remaining = Math.max(slaSeconds - localElapsed, 0);
  const clockSeconds = remaining;
  const minutes = Math.floor(clockSeconds / 60);
  const seconds = String(clockSeconds % 60).padStart(2, "0");

  return (
    <div className="h-full min-h-0 flex flex-col justify-between gap-4 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[clamp(9px,0.8vw,11px)] font-black uppercase tracking-[0.2em] text-indigo-500">
            Atendimento Atual
          </span>
          <h3 className="truncate text-[clamp(22px,1.8vw,34px)] font-black text-slate-900 uppercase tracking-tighter leading-none">
            {user.short_name}
          </h3>
        </div>
        <div className="text-right shrink-0">
          {isOverdue ? (
            <>
              <span className="text-[clamp(12px,1.05vw,16px)] font-black uppercase tracking-[0.12em] text-amber-600 leading-none">
                Atendimento quase concluído
              </span>
              <span className="text-[clamp(8px,0.75vw,10px)] font-black uppercase tracking-[0.2em] text-slate-400 block mt-1">
                Por favor, aguarde
              </span>
            </>
          ) : (
            <>
              <span className="text-[clamp(26px,2.1vw,42px)] font-black tabular-nums leading-none text-slate-900">
                {minutes}:{seconds}
              </span>
              <span className="text-[clamp(8px,0.75vw,10px)] font-black uppercase tracking-[0.2em] text-slate-400 block mt-1">
                Tempo estimado de atendimento
              </span>
            </>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-[2rem] py-4 px-5 xl:px-6 flex items-center gap-3 border border-indigo-100/50">
        <span className="text-[clamp(9px,0.85vw,12px)] font-black text-indigo-300 uppercase tracking-[0.25em] shrink-0">
          Número do ticket
        </span>
        <span className="ml-auto block text-right text-[clamp(30px,2.7vw,56px)] font-black text-indigo-600 tracking-tighter tabular-nums leading-none">
          {user.ticket}
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <Motion.div
            animate={{
              width: `${progress}%`,
              backgroundColor: isOverdue ? "#f59e0b" : "#4f46e5",
            }}
            className="h-full rounded-full shadow-[4px_0_12px_rgba(79,70,229,0.4)]"
          />
        </div>
        <div className="flex justify-between text-[clamp(8px,0.75vw,10px)] font-black uppercase text-slate-400 tracking-[0.2em] px-1">
          <span>{isOverdue ? "Atendimento em curso" : "Progresso do atendimento"}</span>
          <span>{isOverdue ? "Aguarde" : `${Math.round(progress)}%`}</span>
        </div>
      </div>
    </div>
  );
}
