import { useEffect, useState } from "react";

export default function Clock({ reduced = false }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`font-semibold tracking-[0.3em] text-slate-200/90 ${
        reduced ? "text-xl" : "text-3xl"
      }`}
    >
      {time.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
}
