// src/components/QrCodeBox.tsx
import { QRCodeCanvas } from "qrcode.react";
import { useQueueStream } from "../app/providers/QueueStreamProvider";

export default function QrCodeBox({ reduced = false }: { reduced?: boolean }) {
  // Pegamos o usuário chamado do stream para tornar o QR Code inteligente
  const { calledUser } = useQueueStream();

  // 1. Dinamismo de URL:
  // Aponta para o próprio endereço do Frontend (ex: http://192.168.1.50:5173/consultar)
  const baseUrl = window.location.origin;
  const ticketParam = calledUser ? `?ticket=${calledUser.ticket}` : "";
  const finalUrl = `${baseUrl}/consultar${ticketParam}`;

  const inkColor = "#0F172A"; // Slate-900: Contraste máximo para scanners de telemóvel

  if (reduced) {
    return (
      <div className="relative group bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:border-amber-400">
        {/* Pingo de status: Indica que o link é dinâmico */}
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </div>

        <QRCodeCanvas
          value={finalUrl}
          size={64}
          bgColor="#FFFFFF"
          fgColor={inkColor}
          level="H" // High Error Correction: Ideal para telas de TV
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
      {/* Decoração de fundo suave */}
      <div className="absolute inset-x-0 -top-10 h-24 bg-sky-50 blur-3xl opacity-50" />

      <div className="relative p-4 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
        <QRCodeCanvas
          value={finalUrl}
          size={140}
          bgColor="#FFFFFF"
          fgColor={inkColor}
          level="H"
        />
      </div>

      <div className="text-center relative">
        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
          {calledUser ? "Sua Senha no Celular" : "Acompanhe a Fila"}
        </p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
          Escaneie para status live
        </p>
      </div>
    </div>
  );
}
