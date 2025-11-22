import { QRCodeCanvas } from "qrcode.react";

export default function QrCodeBox({ reduced = false }) {
  const url = "http://127.0.0.1:8000/queue/consult";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-sky-200 bg-white/90 shadow-[0_20px_40px_-36px_rgba(14,165,233,0.6)] ${
        reduced ? "px-3 py-3" : "px-6 py-5"
      }`}
    >
      <div
        className="absolute inset-x-10 -top-20 h-40 rounded-full bg-gradient-to-r from-sky-400/40 via-white/30 to-amber-300/40 blur-3xl"
        aria-hidden
      />
      <div
        className={`relative flex flex-col items-center ${
          reduced ? "gap-2" : "gap-3"
        }`}
      >
        <div
          className={`rounded-xl border border-amber-200 bg-white ${
            reduced ? "p-2" : "p-4"
          } transition-transform duration-500 hover:scale-[1.02]`}
        >
          <QRCodeCanvas
            value={url}
            size={reduced ? 80 : 132}
            bgColor="transparent"
            fgColor="#1f2937"
          />
        </div>
        <p
          className={`max-w-[12rem] text-center font-medium leading-tight ${
            reduced ? "text-[0.65rem]" : "text-sm"
          }`}
        >
          Aponte a câmera para acompanhar sua posição na fila em tempo real.
        </p>
      </div>
    </div>
  );
}
