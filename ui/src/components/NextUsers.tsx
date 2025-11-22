import { motion as Motion, AnimatePresence } from "motion/react";
import { QueueUser } from "../types/queue";

interface NextUsersProps {
  users: QueueUser[];
  reduced?: boolean;
}

export default function NextUsers({ users = [], reduced = false }: NextUsersProps) {
  if (!users.length) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl border border-dashed border-sky-200 bg-white/85 text-center text-slate-500 ${
          reduced ? "py-6 px-3 text-sm" : "py-12 px-6"
        }`}
      >
        Nenhum próximo na fila neste momento.
      </div>
    );
  }

  const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`rounded-3xl border border-sky-200/80 bg-white/95 ${
        reduced ? "p-3" : "p-6"
      } shadow-[0_24px_40px_-32px_rgba(14,165,233,0.5)]`}
    >
      <div className={`mb-3 flex items-center justify-between ${reduced ? "gap-2" : "gap-4"}`}>
        <div className="flex flex-col gap-1 text-left">
          <span className={`uppercase text-slate-500/80 ${reduced ? "text-[0.6rem]" : "text-xs"} tracking-[0.5em]`}>
            Próximos chamados
          </span>
          <h3 className={`${reduced ? "text-lg" : "text-2xl"} font-semibold text-slate-900`}>
            Prepare-se
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Atualização automática
        </div>
      </div>

      <div className={`${reduced ? "space-y-2" : "space-y-3"} ${reduced ? "" : "max-h-[48vh] overflow-y-auto"} pr-2`}>
        <AnimatePresence initial={false}>
          {users.map((user, idx) => (
            <Motion.div
              key={user.id}
              className={`group flex items-center justify-between gap-3 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-white via-sky-50 to-amber-50 transition duration-500 hover:border-amber-300 hover:shadow-[0_16px_30px_-24px_rgba(249,115,22,0.6)] ${
                reduced ? "px-3 py-2" : "px-5 py-4"
              }`}
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center rounded-2xl text-white font-bold shadow-lg shadow-sky-500/35 ${
                    reduced ? "h-8 w-8 text-lg" : "h-12 w-12 text-2xl"
                  } bg-gradient-to-br from-sky-500 via-sky-400 to-amber-300`}
                >
                  {idx + 1}
                </span>
                <div className="flex flex-col">
                  <span className={`uppercase text-slate-500/80 ${reduced ? "text-[0.55rem]" : "text-sm"}`}>Senha</span>
                  <span className={`${reduced ? "text-sm" : "text-xl"} font-semibold text-slate-800`}>
                    {user.id_hint ?? "---"}
                  </span>
                </div>
              </div>
              <div className="flex-1 text-right">
                <p className={`${reduced ? "text-sm" : "text-base"} font-semibold text-slate-700`}>
                  {user.name ?? "Cliente"}
                </p>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
