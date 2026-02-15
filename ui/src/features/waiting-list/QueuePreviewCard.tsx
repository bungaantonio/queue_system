// src/features/waiting-list/QueuePreviewCard.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

// src/features/waiting-list/QueuePreviewCard.tsx
export default function QueuePreviewCard() {
  const { nextUsers } = useQueueStream();
  const visibleUsers = (nextUsers || []).slice(0, 6);

  return (
    <div className="h-full min-h-0 flex flex-col p-5">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
          Próximos na Fila
        </span>
        <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full">
          {nextUsers?.length || 0} na fila
        </span>
      </div>

      <div className="flex-1 min-h-0 space-y-2 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {visibleUsers.map((user, idx) => (
            <Motion.div
              key={user.id}
              layout
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 min-h-0"
            >
              <span className="text-[10px] font-black text-slate-300 w-4 shrink-0">
                {idx + 1}
              </span>
              <span className="text-xl font-black text-slate-900 tabular-nums w-20 shrink-0 leading-none">
                {user.ticket}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase truncate min-w-0">
                {user.short_name}
              </span>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
