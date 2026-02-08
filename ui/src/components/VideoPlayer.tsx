// src/components/VideoPlayer.tsx
import { useEffect, useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";

const videos = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
  "/videos/video4.mp4",
  "/videos/video5.mp4",
  "/videos/video6.mp4",
];

export default function VideoPlayer() {
  const [current, setCurrent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Tenta autoplay quando o vídeo atual muda
  useEffect(() => {
    if (!videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // autoplay pode ser bloqueado em alguns browsers
      });
    }
  }, [current]);

  // Passa para o próximo vídeo
  const handleEnded = () => {
    setIsReady(false);
    setCurrent((prev) => (prev + 1) % videos.length);
  };

  return (
    <div className="relative h-full w-full bg-slate-950 rounded-3xl overflow-hidden shadow-lg">
      <AnimatePresence mode="wait">
        {/* Motion.div controla a animação de fade */}
        <Motion.div
          key={current}
          className="absolute inset-0 h-full w-full"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: isReady ? 1 : 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            src={videos[current]}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleEnded}
            onLoadedData={() => setIsReady(true)}
            className="h-full w-full object-cover"
          />
        </Motion.div>
      </AnimatePresence>

      {/* Overlay discreto de informação */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="backdrop-blur-md bg-black/20 p-4 rounded-2xl border border-white/10">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 block mb-1">
            Reproduzindo
          </span>
          <h1 className="text-white font-medium tracking-tight">
            Informativo Institucional
          </h1>
        </div>
      </div>
    </div>
  );
}
