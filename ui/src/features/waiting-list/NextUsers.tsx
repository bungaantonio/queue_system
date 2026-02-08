// src/features/waiting-list/NextUsers.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";
import { QueueUser } from "../../domain/queue/queue.types";

interface NextUsersProps {
  reduced?: boolean;
}

export default function NextUsers({ reduced = false }: NextUsersProps) {
  const { nextUsers } = useQueueStream();

  const itemVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div
      className={`flex flex-col h-full ${reduced ? "" : "p-6 bg-white rounded-[2rem] shadow-xl border border-slate-100"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
            Próximos
          </span>
          {!reduced && (
            <h3 className="text-xl font-bold text-slate-800">Fila de espera</h3>
          )}
        </div>
        <div className="px-2 py-1 bg-sky-50 rounded-lg flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[9px] font-bold text-sky-700 uppercase leading-none">
            Live
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {nextUsers.slice(0, 3).map((user, idx) => (
            <Motion.div
              key={user.id}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: idx * 0.05,
              }}
              className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-sky-200 transition-colors"
            >
              <span className="flex-none h-8 w-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 shadow-sm">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-1">
                  Senha
                </p>
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  {user.ticket}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700 truncate max-w-[120px] uppercase tracking-tighter">
                  {user.short_name}
                </p>
              </div>
            </Motion.div>
          ))}
          {!nextUsers ||
            (nextUsers.length === 0 && (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                  Fila vazia
                </span>
              </div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
