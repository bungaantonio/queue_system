// src/features/timer/ActiveUserCard.tsx
import {useEffect, useState} from "react";
import {useQueueStream} from "../../app/providers/QueueStreamProvider";
import useTimer from "./useTimer";
import {motion as Motion} from "motion/react";

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
          Balcão Disponível
        </span>
      </div>
    );
  }

  const isOverdue = localElapsed >= slaSeconds;
  const progress = Math.min((localElapsed / slaSeconds) * 100, 100);
  const clockSeconds = Math.max(slaSeconds - localElapsed, 0);
  const minutes = Math.floor(clockSeconds / 60);
  const seconds = String(clockSeconds % 60).padStart(2, "0");

  return (
    <div className="h-full min-h-0 flex flex-col justify-between gap-4 overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[clamp(8px,0.7vw,10px)] font-black uppercase tracking-[0.18em] text-indigo-500">
            Em atendimento
          </span>
          <h3 className="truncate text-[clamp(18px,1.35vw,26px)] font-black text-slate-900 uppercase tracking-tight leading-none">
            {user.short_name}
          </h3>
        </div>
        <div className="text-right shrink-0 min-w-0 max-w-[15rem]">
          {isOverdue ? (
            <>
              <span className="block truncate whitespace-nowrap text-[clamp(11px,0.85vw,14px)] font-black uppercase tracking-[0.1em] text-amber-600 leading-none">
                A finalizar
              </span>
              <span className="block truncate whitespace-nowrap text-[clamp(7px,0.65vw,9px)] font-black uppercase tracking-[0.16em] text-slate-400 mt-1">
                Aguarde
              </span>
            </>
          ) : (
            <>
              <span className="text-[clamp(22px,1.6vw,32px)] font-black tabular-nums leading-none text-slate-900">
                {minutes}:{seconds}
              </span>
              <span className="block truncate whitespace-nowrap text-[clamp(7px,0.65vw,9px)] font-black uppercase tracking-[0.16em] text-slate-400 mt-1">
                Tempo estimado
              </span>
            </>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-4xl py-4 px-5 xl:px-6 flex items-center gap-3 border border-indigo-100/50">
        <span className="text-[clamp(8px,0.72vw,10px)] font-black text-indigo-300 uppercase tracking-[0.2em] shrink-0">
          Ticket
        </span>
        <span className="ml-auto block text-right text-[clamp(24px,2vw,40px)] font-black text-indigo-600 tracking-tight tabular-nums leading-none">
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
        <div className="flex justify-between gap-3 text-[clamp(7px,0.65vw,9px)] font-black uppercase text-slate-400 tracking-[0.16em] px-1">
          <span className="truncate whitespace-nowrap">{isOverdue ? "Em curso" : "Progresso"}</span>
          <span className="shrink-0 whitespace-nowrap">{isOverdue ? "Aguarde" : `${Math.round(progress)}%`}</span>
        </div>
      </div>
    </div>
  );
}
