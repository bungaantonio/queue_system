import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface TimerProps {
  keyProp?: string | number;
  reduced?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({ keyProp, reduced = false }: TimerProps) {
  return (
    <div
      className={`flex justify-center ${reduced ? "min-h-[80px]" : "min-h-[140px]"} w-full`}
    >
      <CountdownCircleTimer
        key={keyProp}
        isPlaying
        duration={150}
        strokeWidth={reduced ? 6 : 10}
        colors={["#0284c7", "#0ea5e9", "#f97316", "#dc2626"]}
        colorsTime={[150, 90, 30, 0]}
        trailColor="rgba(14, 116, 144, 0.18)"
      >
        {({ remainingTime }) => (
          <span
            className={`font-semibold tracking-tight transition-colors duration-300 ${
              remainingTime <= 10 ? "text-rose-500" : "text-slate-800"
            } ${reduced ? "text-xl lg:text-2xl" : "text-2xl lg:text-4xl"}`}
          >
            {formatTime(remainingTime)}
          </span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
