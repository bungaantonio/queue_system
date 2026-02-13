// domain/queue/queue.types.ts

export interface QueueUser {
  id: number;
  status: string;
  short_name: string;
  ticket: string;
  position: number;
  attendance_type: string; // "normal" | "priority"
  timestamp: string; // ISO String
}

export interface QueueState {
  current: QueueUser | null;
  called: QueueUser | null;
  queue: QueueUser[];
}

export interface Timer {
  current_user: QueueUser | null;
  sla_seconds: number;
  elapsed_seconds: number;
  status: "Pendente" | "Ultrapassado";
}