// src/utils/dateUtils.ts

const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/**
 * Retorna o mês abreviado e o dia do mês para a data atual
 */
export function obterMesEDiaAtual(): { mes: string; dia: number } {
    const agora = new Date();
    const mes = MESES_ABREV[agora.getMonth()]; // 0-11
    const dia = agora.getDate();
    return { mes, dia };
}
