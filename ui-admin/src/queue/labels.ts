import { QueueUser, UserStatus } from "../modules/queue/types";

export const ATTENDANCE_TYPE_COLOR: Record<QueueUser["attendance_type"], "default" | "warning" | "error"> = {
    normal: "default",
    priority: "warning",
    urgent: "error",
};


export const ATTENDANCE_TYPE_LABELS: Record<
    NonNullable<QueueUser["attendance_type"]>,
    string
> = {
    normal: "Normal",
    priority: "Prioritário",
    urgent: "Urgente",
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
    waiting: "À espera",
    called_pending: "Chamado",
    being_served: "Em atendimento",
    done: "Concluído",
    cancelled: "Cancelado",
};

