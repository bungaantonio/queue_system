export interface QueueUser {
  id: number; // ID único do utente
  name: string; // Nome completo
  status: "waiting" | "called" | "finished"; // Estado atual na fila
  attendance_type?: string; // Tipo de atendimento (opcional)
  created_at?: string; // Timestamp de criação
  updated_at?: string; // Timestamp da última atualização
}
