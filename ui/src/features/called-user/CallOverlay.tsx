// src/components/CallOverlay.tsx
import { motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";

export default function CallOverlay() {
  const { calledUser: user } = useQueueStream();

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-900/90 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            className="text-center text-white"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-8 text-2xl uppercase tracking-[1em] text-sky-300"
            >
              Chamada
            </motion.div>
            <h1 className="text-9xl font-black mb-4 drop-shadow-2xl">
              {user.ticket ?? "---"}
            </h1>
            <p className="text-5xl font-light text-sky-100">
              {user.short_name?.toUpperCase() ?? "---"}
            </p>
          </motion.div>

          {/* Luz de borda animada */}
          <div className="absolute inset-0 border-[20px] border-sky-400 opacity-20 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
