// components/CalledUser.tsx
import { motion as Motion } from "motion/react";
import { QueueUser } from "../types/queue";

interface CalledUserProps {
  user: QueueUser | null;
  reduced?: boolean;
}

export default function CalledUser({ user, reduced = false }: CalledUserProps) {
  if (!user) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-yellow-300 bg-white/85 text-center text-slate-500 ${
          reduced ? "min-h-[80px] py-4 px-4" : "min-h-[140px] py-12 px-8"
        }`}
      >
        <span className={`uppercase text-slate-500/80 ${reduced ? "text-[0.6rem]" : "text-sm"}`}>
          Nenhum cliente chamado
        </span>
        <p className={`text-slate-600/90 ${reduced ? "text-sm" : "text-lg"}`}>
          Assim que um cliente for chamado, os detalhes aparecerão aqui.
        </p>
      </div>
    );
  }

  // **Usa exatamente o que vem do backend**
  const { name, id_hint } = user;

  return (
    <Motion.div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-200 ${
        reduced ? "p-4" : "p-8"
      } shadow-[0_18px_40px_-18px_rgba(202,138,4,0.45)]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 -translate-y-1/2 rounded-full bg-white/40 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-3 text-yellow-900">
        <div className="space-y-1 text-left">
          <span className={`uppercase ${reduced ? "text-[0.55rem]" : "text-xs"} tracking-[0.4em] text-yellow-800/80`}>
            Chamado agora
          </span>
          <h2 className={`${reduced ? "text-xl" : "text-4xl"} font-bold leading-tight`}>
            {name.toUpperCase()}
          </h2>
        </div>
        <div className={`relative flex items-center justify-between rounded-2xl border border-yellow-500/50 bg-yellow-50/60 ${
          reduced ? "p-3" : "p-6"
        }`}>
          <div className="flex flex-col gap-1 text-yellow-900">
            <span className={`uppercase ${reduced ? "text-[0.55rem]" : "text-xs"} tracking-[0.4em]`}>
              Senha
            </span>
            <span className={`${reduced ? "text-xl" : "text-3xl"} font-semibold drop-shadow-sm`}>
              {id_hint ?? "---"}
            </span>
          </div>
          <Motion.div
            className={`rounded-full border border-yellow-500 bg-yellow-100 px-3 py-1 text-yellow-800 ${
              reduced ? "text-xs px-3 py-1" : "px-5 py-2"
            }`}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(202,138,4,0.38)",
                "0 0 0 12px rgba(202,138,4,0)",
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          >
            Aguardando verificação
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  );
}
