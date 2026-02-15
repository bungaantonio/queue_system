// src/components/Clock.tsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="tabular-nums">
      {time.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // Adicionei segundos para dar sensação de "Live" no rodapé
      })}
    </span>
  );
}
