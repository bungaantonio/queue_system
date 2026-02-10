// src/components/QrCodeBox.tsx
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeBoxProps {
  reduced?: boolean;
}

export default function QrCodeBox({ reduced = false }: QrCodeBoxProps) {
  const url = "http://127.0.0.1:8000/api/v1/queue/consult";

  // Cores do Sistema de Design
  const COLORS = {
    // Um azul marinho quase preto: passa autoridade e tem contraste máximo
    ink: "#0F172A", // slate-900
    amberDark: "#92400E", // amber-800
  };

  if (reduced) {
    return (
      <div className="group relative bg-white p-2 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-amber-200/60 transition-all duration-500 hover:border-amber-400">
        {/* Pequeno detalhe estético: um brilho no canto para indicar "escanear" */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping opacity-75" />

        <QRCodeCanvas
          value={url}
          size={64}
          bgColor="#FFFFFF" // Fundo branco puro dentro do QR aumenta o sucesso do scan
          fgColor={COLORS.ink} // Usamos o Slate-900 para combinar com o Relógio
          level="H" // High error correction: permite scan mesmo com reflexos na TV
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-2xl">
      <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-sky-100/50 to-transparent blur-3xl opacity-50" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="p-4 bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-slate-100">
          <QRCodeCanvas
            value={url}
            size={160}
            bgColor="#FFFFFF"
            fgColor={COLORS.ink}
            level="H"
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-slate-800 uppercase tracking-tighter">
            Sua posição na fila
          </p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
            Aponte a câmera do celular
          </p>
        </div>
      </div>
    </div>
  );
}
