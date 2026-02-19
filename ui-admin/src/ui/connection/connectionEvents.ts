import { useEffect, useState } from "react";

const dispatch = (name: string) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name));
};

export const notifyServerUnavailable = () => dispatch("qms:server-unavailable");
export const notifyServerAvailable = () => dispatch("qms:server-available");
export const notifySseDisconnected = () => dispatch("qms:sse-disconnected");
export const notifySseConnected = () => dispatch("qms:sse-connected");

export const useConnectionStatus = () => {
  const [serverUnavailable, setServerUnavailable] = useState(false);
  const [sseConnected, setSseConnected] = useState(true);
  const [isOnline, setIsOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleServerUnavailable = () => setServerUnavailable(true);
    const handleServerAvailable = () => setServerUnavailable(false);
    const handleSseDisconnected = () => setSseConnected(false);
    const handleSseConnected = () => setSseConnected(true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("qms:server-unavailable", handleServerUnavailable);
    window.addEventListener("qms:server-available", handleServerAvailable);
    window.addEventListener("qms:sse-disconnected", handleSseDisconnected);
    window.addEventListener("qms:sse-connected", handleSseConnected);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener(
        "qms:server-unavailable",
        handleServerUnavailable,
      );
      window.removeEventListener("qms:server-available", handleServerAvailable);
      window.removeEventListener(
        "qms:sse-disconnected",
        handleSseDisconnected,
      );
      window.removeEventListener("qms:sse-connected", handleSseConnected);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    serverUnavailable,
    sseConnected,
  };
};
