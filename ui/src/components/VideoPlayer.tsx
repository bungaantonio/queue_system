import { motion as Motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // autoplay pode ser bloqueado por alguns browsers
      });
    }
  }, [current]);

  const handleEnded = () => {
    setIsReady(false);
    setCurrent((prev) => (prev + 1) % videos.length);
  };

  return (
    <div className="group relative flex h-full w-full min-h-[250px] sm:min-h-[300px] items-center justify-center overflow-hidden rounded-3xl bg-slate-950/80 shadow-[0_20px_45px_-20px_rgba(56,189,248,0.45)]">
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-slate-950/40 via-slate-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-60" />
      <AnimatePresence mode="wait">
        <Motion.video
          key={current}
          ref={videoRef}
          src={videos[current]}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onLoadedData={() => setIsReady(true)}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0.1, scale: 1.02 }}
          animate={{ opacity: isReady ? 1 : 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <div className="relative z-20 hidden h-full w-full flex flex-col justify-between px-8 py-8 text-left text-white lg:flex">
        <div>
          <span className="text-sm uppercase tracking-[0.5em] text-white/60">
            Acontecendo agora
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-white/90">
            Conteúdo institucional em reprodução contínua
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-100/80">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Próximo vídeo em instantes
        </div>
      </div>
    </div>
  );
}
