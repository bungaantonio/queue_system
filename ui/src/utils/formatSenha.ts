// src/utils/senhaSpeech.ts
export function formatSenhaForSpeech(senha: string): string {
  if (!senha) return "";

  const numeros: Record<string, string> = {
    "0": "zero",
    "1": "um",
    "2": "dois",
    "3": "três",
    "4": "quatro",
    "5": "cinco",
    "6": "seis",
    "7": "sete",
    "8": "oito",
    "9": "nove",
  };

  const soletrado = senha
    .split("")
    .map(c => (/[0-9]/.test(c) ? numeros[c] : c.toUpperCase()))
    .join(", ");

  return `Senha ${soletrado}`;
}
