// src/components/MarqueeTicker.tsx
export default function MarqueeTicker() {
  const news = [
    "Bem-vindo ao nosso centro de atendimento.",
    "Lembre-se de ter seus documentos em mãos.",
    "Acompanhe sua posição na fila pelo QR Code.",
    "Horário de funcionamento: 08:00 às 18:00.",
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white py-2 overflow-hidden whitespace-nowrap border-t border-white/10">
      <div className="inline-block animate-marquee whitespace-nowrap">
        {news.map((item, i) => (
          <span
            key={i}
            className="mx-10 text-sm font-medium uppercase tracking-widest"
          >
            • {item}
          </span>
        ))}
      </div>
      {/* Duplicado para loop infinito */}
      <div className="inline-block animate-marquee whitespace-nowrap">
        {news.map((item, i) => (
          <span
            key={i}
            className="mx-10 text-sm font-medium uppercase tracking-widest"
          >
            • {item}
          </span>
        ))}
      </div>
    </div>
  );
}
