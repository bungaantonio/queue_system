export type QueueStatus =
  | "waiting"
  | "called_pending"
  | "being_served"
  | "called"
  | "finished";

export type AttendanceType = "normal" | "priority" | "urgent";

export interface QueueUserRef {
  id: number;
  name: string;
  id_number?: string;
}

export interface QueueEntryApi {
  id: number;
  status: QueueStatus;
  position: number;
  attendance_type?: AttendanceType;
  timestamp?: string;
  user: QueueUserRef;
  short_name?: string;
  ticket?: string;
}

export interface QueueSnapshotApi {
  current: QueueEntryApi | null;
  called: QueueEntryApi | null;
  queue: QueueEntryApi[];
  timer: number | null;
}

export interface QueueEntry {
  id: number;
  status: QueueStatus;
  position: number;
  name: string;
  shortName: string;
  ticket?: string;
  attendanceType?: AttendanceType;
  timestamp?: string;
  userId: number;
  userDocumentId?: string;
}

export interface QueueSnapshot {
  current: QueueEntry | null;
  called: QueueEntry | null;
  queue: QueueEntry[];
  timer: number | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const toQueueEntry = (input: QueueEntryApi): QueueEntry => ({
  id: input.id,
  status: input.status,
  position: input.position,
  name: input.user?.name ?? input.short_name ?? `Utente #${input.id}`,
  shortName: input.short_name ?? input.user?.name ?? `Utente #${input.id}`,
  ticket: input.ticket,
  attendanceType: input.attendance_type,
  timestamp: input.timestamp,
  userId: input.user?.id ?? 0,
  userDocumentId: input.user?.id_number,
});

const hasQueueShape = (value: unknown): value is QueueSnapshotApi => {
  if (!isRecord(value)) return false;
  return (
    "queue" in value &&
    Array.isArray(value.queue) &&
    "current" in value &&
    "called" in value
  );
};

export const normalizeQueueSnapshot = (
  payload: unknown,
): QueueSnapshot | null => {
  const base = isRecord(payload) && "data" in payload ? payload.data : payload;
  if (!hasQueueShape(base)) return null;

  return {
    queue: base.queue.map(toQueueEntry),
    current: base.current ? toQueueEntry(base.current) : null,
    called: base.called ? toQueueEntry(base.called) : null,
    timer: typeof base.timer === "number" ? base.timer : null,
  };
};
