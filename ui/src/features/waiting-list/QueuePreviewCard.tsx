// src/features/waiting-list/QueuePreviewCard.tsx
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function QueuePreviewCard({ reduced = false }: { reduced?: boolean }) {
  const { nextUsers } = useQueueStream();
  const usersToShow = reduced ? 2 : 4;

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm ${reduced ? "p-4" : "p-5"}`}
    >
      <div className={`flex items-center justify-between ${reduced ? "mb-2" : "mb-3"}`}>
        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400">
          Próximos
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
      </div>

      <div className={reduced ? "space-y-1.5" : "space-y-2"}>
        <AnimatePresence initial={false} mode="popLayout">
          {nextUsers?.slice(0, usersToShow).map(
            (
              user,
              idx,
            ) => (
              <Motion.div
                key={user.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center rounded-2xl border border-slate-100 bg-slate-50 ${reduced ? "gap-2.5 p-2.5" : "gap-3 p-3"}`}
              >
                <div
                  className={`flex items-center justify-center rounded-lg border border-slate-200 bg-white font-black text-slate-400 ${reduced ? "h-7 w-7 text-[9px]" : "h-8 w-8 text-[10px]"}`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-black leading-none text-slate-900 ${reduced ? "text-[13px]" : "text-sm"}`}
                  >
                    {user.ticket}
                  </p>
                  <p
                    className={`truncate font-bold uppercase text-slate-400 ${reduced ? "text-[8px]" : "text-[9px]"}`}
                  >
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
