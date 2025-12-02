import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

interface TimerProps {
  keyProp?: string | number;
  reduced?: boolean;
}

interface TimerData {
  current_user: { id: number; name: string } | null;
  sla_minutes: number;
  status: string;
  elapsed_seconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({ keyProp, reduced = false }: TimerProps) {
  const [timerData, setTimerData] = useState<TimerData>({
    current_user: null,
    sla_minutes: 0,
    status: "Nenhum usuário ativo",
    elapsed_seconds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/monitoring/timer");
        const data = await res.json();
        setTimerData(data);
      } catch (err) {
        console.error("Erro ao buscar dados do timer", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Evita NaN
  const totalSeconds = Math.max(timerData.sla_minutes * 60, 0);
  const elapsed = Math.max(timerData.elapsed_seconds, 0);
  const initialRemaining = Math.max(totalSeconds - elapsed, 0);
  const progressPercentage =
    totalSeconds > 0 ? ((totalSeconds - initialRemaining) / totalSeconds) * 100 : 0;

  // Cor da barra de progresso baseada no status
  const progressColor = timerData.status === "Ultrapassado" ? "#dc2626" : "#22c55e";

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Timer visual */}
      <div
        className={`flex justify-center ${
          reduced ? "min-h-[80px]" : "min-h-[140px]"
        } w-full`}
      >
        {totalSeconds > 0 && (
          <CountdownCircleTimer
            key={keyProp || timerData.current_user?.id || 0}
            isPlaying
            duration={totalSeconds}
            initialRemainingTime={initialRemaining}
            strokeWidth={reduced ? 6 : 10}
            colors={["#0284c7", "#0ea5e9", "#f97316", "#dc2626"]}
            colorsTime={[totalSeconds, totalSeconds / 2, 30, 0]}
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
        )}
      </div>

      {/* Informações complementares */}
      <div className="text-center space-y-1">
        <p className="text-sm text-slate-600">
          Usuário:{" "}
          <span className="font-medium">{timerData.current_user?.name || "Nenhum"}</span>
        </p>
        <p className="text-sm text-slate-600">
          SLA previsto:{" "}
          <span className="font-medium">{timerData.sla_minutes} min</span>
        </p>
        <p
          className={`text-xs font-semibold uppercase tracking-wide ${
            timerData.status === "Ultrapassado" ? "text-rose-500" : "text-emerald-600"
          }`}
        >
          {timerData.status}
        </p>
      </div>

      {/* Indicador de progresso visual */}
      <div className="w-full max-w-[240px] bg-slate-200/50 rounded-full h-2 overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progressPercentage}%`, backgroundColor: progressColor }}
        />
      </div>
    </div>
  );
}
