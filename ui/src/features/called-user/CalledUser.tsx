// features/called-user/CalledUser.tsx
import { motion as Motion } from "motion/react";
import useQueueData  from "./useQueueData";

interface CalledUserProps {
  reduced?: boolean;
}

export default function CalledUser({ reduced = false }: CalledUserProps) {
  // Pega o usuário chamado do provider
  const { calledUser: user } = useQueueData();

  // Caso não haja usuário chamado
  if (!user) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-yellow-300 bg-white/85 text-center text-slate-500 transition-all duration-300 ${
          reduced ? "min-h-[80px] py-4 px-4" : "min-h-[140px] py-12 px-8"
        }`}
      >
        <span
          className={`uppercase text-slate-500/80 ${
            reduced ? "text-[0.6rem]" : "text-sm"
          }`}
        >
          Nenhum cliente chamado
        </span>
        <p className={`${reduced ? "text-sm" : "text-lg"} text-slate-600/90`}>
          Assim que um cliente for chamado, os detalhes aparecerão aqui.
        </p>
      </div>
    );
  }

  // Extrai dados já normalizados do backend
  const { short_name, ticket } = user;

  return (
    <Motion.div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-200 ${
        reduced ? "p-4" : "p-8"
      } shadow-[0_18px_40px_-18px_rgba(202,138,4,0.45)] transition-all duration-300`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Overlay de brilho decorativo */}
      <div
        className="pointer-events-none absolute inset-0 -translate-y-1/2 rounded-full bg-white/40 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-3 text-yellow-900">
        {/* Cabeçalho: "Chamado agora" + Nome */}
        <div className="space-y-1 text-left">
          <span
            className={`uppercase tracking-[0.4em] text-yellow-800/80 ${
              reduced ? "text-[0.55rem]" : "text-xs"
            }`}
          >
            Chamado agora
          </span>
          <h2
            className={`${reduced ? "text-xl" : "text-4xl"} font-bold leading-tight`}
          >
            {short_name?.toUpperCase() ?? "---"}
          </h2>
        </div>

        {/* Card de senha e status */}
        <div
          className={`relative flex items-center justify-between rounded-2xl border border-yellow-500/50 bg-yellow-50/60 ${
            reduced ? "p-3" : "p-6"
          }`}
        >
          {/* Senha do usuário */}
          <div className="flex flex-col gap-1 text-yellow-900">
            <span
              className={`uppercase tracking-[0.4em] ${
                reduced ? "text-[0.55rem]" : "text-xs"
              }`}
            >
              Senha
            </span>
            <span
              className={`${reduced ? "text-xl" : "text-3xl"} font-semibold drop-shadow-sm`}
            >
              {ticket ?? "---"}
            </span>
          </div>

          {/* Status animado */}
          <Motion.div
            className={`rounded-full border border-yellow-500 bg-yellow-100 text-yellow-800 flex items-center justify-center ${
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
