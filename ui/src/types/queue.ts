// types/queue.ts

/**
 * Usuário simplificado para listagem / SSE
 * Baseado em map_to_queue_list
 */
export interface QueueUser {
  id: number; // id do queue_item
  name: string; // short_name (primeiro nome + inicial do sobrenome)
  id_hint?: string; // últimos 5 dígitos do documento
  position: number;
  status: string;
  timestamp: string; // ISO string
}

/**
 * Usuário detalhado, seguro para frontend
 * Baseado em map_to_queue_detail
 */
export interface QueueUserDetail extends QueueUser {
  phone?: string; // últimos 4 dígitos, mascarado
  birth_date?: string; // ISO string ou null
}

export interface QueueState {
  current: QueueUser | null;
  called: QueueUser | null;
  queue: QueueUser[];
}
