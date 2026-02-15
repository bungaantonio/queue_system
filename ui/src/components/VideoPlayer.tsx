// src/components/VideoPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";

export default function VideoPlayer() {
  const [current, setCurrent] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videos = ["/videos/video1.mp4", "/videos/video2.mp4"]; // Simplificado para o exemplo

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [current]);

  return (
    <div className="relative h-full w-full bg-black">
      {/* Overlay de gradiente superior para leitura */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10" />

      <AnimatePresence mode="wait">
        <Motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="h-full w-full"
        >
          <video
            ref={videoRef}
            src={videos[current]}
            autoPlay
            muted
            playsInline
            onEnded={() => {
              setIsReady(false);
              setCurrent((p) => (p + 1) % videos.length);
            }}
            onLoadedData={() => setIsReady(true)}
            className="h-full w-full object-cover"
          />
        </Motion.div>
      </AnimatePresence>

      {/* Info Badge - Estilo Coeso */}
      <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
        <div className="bg-indigo-600 px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/30">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black tracking-[0.3em] text-white/50">
            Agora no Painel
          </span>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">
            Conteúdo Institucional
          </h1>
        </div>
      </div>
    </div>
  );
}
