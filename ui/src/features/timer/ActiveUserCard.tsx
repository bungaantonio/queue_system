// src/features/timer/ActiveUserCard.tsx
import { useEffect, useState } from "react";
import useTimer from "./useTimer";
import { motion as Motion } from "motion/react";

export default function ActiveUserCard() {
  const { currentUser, slaSeconds, elapsed, status } = useTimer();
  const [localElapsed, setLocalElapsed] = useState(elapsed);

  useEffect(() => {
    if (!currentUser) return;
    setLocalElapsed(elapsed);
    const interval = setInterval(() => setLocalElapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, [currentUser?.id, elapsed]);

  const remaining = Math.max(slaSeconds - localElapsed, 0);
  const isOverdue = status === "Ultrapassado" || localElapsed >= slaSeconds;
  const progress = Math.min((localElapsed / slaSeconds) * 100, 100);

  if (!currentUser) return null;

  const displayTime = isOverdue ? localElapsed - slaSeconds : remaining;
  const mins = Math.floor(displayTime / 60);
  const secs = displayTime % 60;

  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
            Atendimento Atual
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">
            {currentUser.short_name}
          </h3>
        </div>

        <div
          className={`flex items-center gap-2 rounded-xl border px-2.5 py-1 ${
            isOverdue
              ? "bg-amber-50 border-amber-100 text-amber-700"
              : "bg-emerald-50 border-emerald-100 text-emerald-700"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${isOverdue ? "bg-amber-500" : "bg-emerald-500"} animate-pulse`}
          />
          <span className="text-[9px] font-black uppercase tracking-wider">
            {isOverdue ? "Finalizando" : "No Tempo"}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
        <div className="flex flex-col">
          <span
            className={`text-[2.2rem] font-black tabular-nums tracking-tighter leading-none ${isOverdue ? "text-amber-600" : "text-slate-900"}`}
          >
            {mins}:{String(secs).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {isOverdue ? "Tempo Excedido" : "Tempo Restante"}
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
          SLA
        </span>
      </div>

      <div className="space-y-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <Motion.div
            initial={false}
            animate={{
              width: `${isOverdue ? 100 : progress}%`,
              backgroundColor: isOverdue ? "#d97706" : "#6366f1",
            }}
            transition={{ duration: 1, ease: "linear" }}
            className="h-full rounded-full"
          />
        </div>
        <p className="text-center text-[8px] font-bold uppercase tracking-[0.1em] text-slate-400">
          {isOverdue ? "Atenção ao tempo de atendimento" : "Atendimento dentro do tempo"}
        </p>
      </div>
    </div>
  );
}
