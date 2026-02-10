import { QueueUser } from "./queue.types";

export function mapToQueueUser(raw: any): QueueUser {
  return {
    id: raw.id,
    short_name: raw.user?.name.split(" ")[0] ?? "Desconhecido",
    ticket: raw.ticket,
    attendance_type: raw.attendance_type,
    position: raw.position ?? 0,
    status: raw.status ?? "UNKNOWN",
    timestamp: raw.timestamp ?? new Date().toISOString(),
  };
}
