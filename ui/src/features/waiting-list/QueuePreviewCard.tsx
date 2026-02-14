// src/features/waiting-list/NextUsers.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

interface NextUsersProps {
  reduced?: boolean;
}

// src/features/waiting-list/NextUsers.tsx
export default function NextUsers({ reduced = false }: { reduced?: boolean }) {
  const { nextUsers } = useQueueStream();

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400">
          Próximos
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {nextUsers?.slice(0, 2).map(
            (
              user,
              idx, // Apenas 2 itens para caber na altura de 611px
            ) => (
              <Motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-[10px] font-black text-slate-400">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 leading-none">
                    {user.ticket}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase truncate">
                    {user.short_name}
                  </p>
                </div>
              </Motion.div>
            ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
