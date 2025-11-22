export function formatSenhaForSpeech(senha: string | null | undefined): string {
  if (!senha) return "";

  const numeros: Record<string, string> = {
    0: "zero",
    1: "um",
    2: "dois",
    3: "três",
    4: "quatro",
    5: "cinco",
    6: "seis",
    7: "sete",
    8: "oito",
    9: "nove",
  };

  return senha
    .split("")
    .map((char) => {
      if (/[0-9]/.test(char)) return numeros[char];
      if (/[a-zA-Z]/.test(char)) return char.toUpperCase();
      return char; // mantém qualquer outro símbolo
    })
    .join(" "); // espaço simples para naturalidade
}
