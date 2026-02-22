export interface AttendanceMetric {
  id: number;
  cenario: string;
  tipo: string | null;
  status: string | null;
  biometria: boolean | null;
  t_entrada: string | null;
  t_chamada: string | null;
  t_fim: string | null;
  espera_seg: number | null;
  atendimento_seg: number | null;
}

