import { motion as Motion } from "motion/react";
import { QueueUser } from "../types/queue";

interface CurrentUserProps {
  user: QueueUser | null;
  reduced?: boolean;
}

export default function CurrentUser({ user, reduced = false }: CurrentUserProps) {
  if (!user) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-sky-200 bg-white/85 text-center text-slate-500 ${
          reduced ? "min-h-[80px] py-4 px-4" : "min-h-[140px] py-12 px-8"
        }`}
      >
        <span
          className={`uppercase text-slate-500/80 ${
            reduced ? "text-[0.6rem] tracking-[0.3em]" : "text-sm tracking-[0.4em]"
          }`}
        >
          Aguardando próximo atendimento
        </span>
        <p className={`text-slate-600/90 ${reduced ? "text-sm" : "text-lg"}`}>
          Assim que um novo cliente for chamado, os detalhes aparecerão aqui.
        </p>
      </div>
    );
  }

  // Frontend não precisa manipular name ou id_hint — já vêm prontos
  const { name, id_hint } = user;

  return (
    <Motion.div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-400 to-amber-300 ${
        reduced ? "p-4" : "p-8"
      } shadow-[0_18px_40px_-18px_rgba(234,88,12,0.45)]`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -translate-y-1/2 rounded-full bg-white/30 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-3 text-white">
        <div className="space-y-1 text-left">
          <span
            className={`uppercase text-white/80 ${
              reduced ? "text-[0.55rem] tracking-[0.4em]" : "text-xs tracking-[0.6em]"
            }`}
          >
            Agora atendendo
          </span>
          <h2 className={`${reduced ? "text-xl" : "text-4xl"} font-bold leading-tight`}>
            {name.toUpperCase()}
          </h2>
        </div>
        <div
          className={`relative flex items-center justify-between rounded-2xl border border-white/50 bg-white/15 ${
            reduced ? "p-3" : "p-6"
          }`}
        >
          <div className="flex flex-col gap-1 text-white/90">
            <span className={`uppercase ${reduced ? "text-[0.55rem]" : "text-xs"} tracking-[0.4em]`}>
              Senha
            </span>
            <span className={`${reduced ? "text-xl" : "text-3xl"} font-semibold drop-shadow-sm`}>
              {id_hint}
            </span>
          </div>
          <Motion.div
            className={`rounded-full border border-white/60 bg-white/10 px-3 py-1 text-white ${
              reduced ? "text-xs px-3 py-1" : "px-5 py-2"
            }`}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(255,255,255,0.38)",
                "0 0 0 12px rgba(255,255,255,0)",
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          >
            Em atendimento
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  );
}
