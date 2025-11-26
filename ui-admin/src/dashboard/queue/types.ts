// src/dashboard/queue/types.ts
export type UserStatus =
    | "waiting"
    | "called_pending"
    | "being_served"
    | "done"
    | "cancelled";
export interface QueueUser {
    id: number;
    name: string;
    status: UserStatus;
    timestamp: string;
    attendance_type?: "normal" | "urgent" | "priority";
}
