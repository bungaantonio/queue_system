// src/components/MarqueeTicker.tsx
export default function MarqueeTicker() {
  const news = [
    "Bem-vindo ao nosso centro de atendimento.",
    "Lembre-se de ter seus documentos em mãos.",
    "Acompanhe sua posição na fila pelo QR Code.",
    "Horário de funcionamento: 08:00 às 18:00.",
  ];

  return (
    <div className="flex items-center w-full h-full bg-slate-900 border-t border-white/5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {/* Renderizamos 3 vezes para garantir que o loop seja invisível em telas ultra-wide */}
        {[...news, ...news, ...news].map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-8 text-sm font-black uppercase tracking-[0.2em] text-white/90">
              {item}
            </span>
            <span className="h-2 w-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
          </div>
        ))}
      </div>
    </div>
  );
}
