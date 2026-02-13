// src/features/timer/Timer.tsx
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useTimer from "./useTimer";

export default function Timer({ reduced = false }: { reduced?: boolean }) {
  const { currentUser, slaSeconds, elapsed, status } = useTimer();
  const remaining = Math.max(slaSeconds - elapsed, 0);

  const color = status === "Ultrapassado" ? "#dc2626" : "#22c55e";

  return (
    <div className={`flex flex-col items-center w-full space-y-4`}>
      <CountdownCircleTimer
        key={currentUser?.id ?? "none"}
        isPlaying={remaining > 0}
        duration={slaSeconds}
        initialRemainingTime={remaining}
        strokeWidth={reduced ? 6 : 10}
        colors={["#0284c7", "#0ea5e9", "#f97316", "#dc2626"]}
        colorsTime={[slaSeconds, slaSeconds / 2, 30, 0]}
      >
        {({ remainingTime }) => (
          <span className={`${reduced ? "text-xl" : "text-4xl"}`}>
            {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
          </span>
        )}
      </CountdownCircleTimer>
      <div className="text-center text-sm text-slate-600">
        Usuário: {currentUser?.short_name ?? "Nenhum"} <br />
        Status: {status}
      </div>
      <div className="w-full max-w-[240px] bg-slate-200/50 rounded-full h-2 overflow-hidden">
        <div className="h-full" style={{ width: `${(elapsed / slaSeconds) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}