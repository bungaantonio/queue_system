// src/components/CallOverlay.tsx
import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { useQueueStream } from "../../app/providers/QueueStreamProvider";
import { useAnnounce } from "../../hooks/useAnnounce";

const OVERLAY_DURATION = 8000; // 8 segundos em tela
const ANNOUNCE_REPETITIONS = 1;
const ANNOUNCE_INTERVAL = 3500;

export default function CallOverlay() {
  const { calledUser: user } = useQueueStream();
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  useAnnounce(user, {
    repetitions: ANNOUNCE_REPETITIONS,
    interval: ANNOUNCE_INTERVAL,
    deskLabel: "Guichê 1",
  });

  useEffect(() => {
    if (user?.id) {
      setActiveUserId(user.id);
      const t = setTimeout(() => setActiveUserId(null), OVERLAY_DURATION);
      return () => clearTimeout(t);
    }
  }, [user?.id]);

  if (!user || activeUserId !== user.id) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-600/98 backdrop-blur-2xl"
      >
        <Motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center text-white"
        >
          <span className="bg-white text-indigo-600 px-10 py-3 rounded-full text-lg font-black uppercase tracking-[0.4em] mb-10 inline-block shadow-2xl">
            Sua Vez
          </span>
          <h1 className="text-[22rem] font-black leading-none tracking-tighter drop-shadow-2xl">
            {user.ticket}
          </h1>
          <p className="text-8xl font-bold opacity-90 uppercase tracking-tight">
            {user.short_name}
          </p>
          <div className="mt-20 h-3 w-80 bg-white/20 mx-auto rounded-full overflow-hidden">
            <Motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 8, ease: "linear" }}
              className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            />
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
}
