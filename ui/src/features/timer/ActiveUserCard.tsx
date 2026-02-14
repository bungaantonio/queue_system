// src/features/timer/Timer.tsx
import { useEffect, useState } from "react";
import useTimer from "./useTimer";
import { motion as Motion } from "motion/react";

export default function Timer() {
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
    <div className="flex flex-col w-full h-full justify-center px-2 space-y-4">
      {/* Linha Superior: Info do Cliente e Status sutil */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
            Em Atendimento
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {currentUser.short_name}
          </h3>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
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

      {/* Bloco Central: Relógio Compacto e direto */}
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex flex-col">
          <span
            className={`text-4xl font-black tabular-nums tracking-tighter leading-none ${isOverdue ? "text-amber-600" : "text-slate-900"}`}
          >
            {mins}:{String(secs).padStart(2, "0")}
          </span>
          <span className="text-[8px] font-bold uppercase text-slate-400 mt-1 tracking-widest">
            {isOverdue ? "Tempo Estendido" : "Tempo Estimado"}
          </span>
        </div>

        {/* Badge do Guichê repetida de forma sutil para reforçar o local */}
        <div className="text-right">
          <span className="text-[8px] font-black text-slate-300 uppercase block mb-1">
            Posto
          </span>
          <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">
            Guichê 01
          </span>
        </div>
      </div>

      {/* Barra de Progresso: Educativa, não punitiva */}
      <div className="space-y-1.5">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <Motion.div
            initial={false}
            animate={{
              width: `${isOverdue ? 100 : progress}%`,
              backgroundColor: isOverdue ? "#d97706" : "#6366f1", // Amber em vez de Red para evitar "raiva"
            }}
            transition={{ duration: 1, ease: "linear" }}
            className="h-full rounded-full"
          />
        </div>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em] text-center">
          {isOverdue
            ? "Garantindo a qualidade do atendimento"
            : "Processo dentro do padrão de eficiência"}
        </p>
      </div>
    </div>
  );
}
