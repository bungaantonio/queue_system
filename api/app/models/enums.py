from enum import Enum


class QueueStatus(str, Enum):
    WAITING = "waiting"
    CALLED_PENDING = "called_pending"
    BEING_SERVED = "being_served"
    DONE = "done"
    CANCELLED = "cancelled"
    SKIPPED = "skipped"

    @property
    def label(self):
        return {
            "waiting": "À espera",
            "called_pending": "Chamado pendente",
            "being_served": "A ser atendido",
            "done": "Concluído",
            "cancelled": "Cancelado",
            "skipped": "Ignorado",
        }[self.value]


class AttendanceType(str, Enum):
    NORMAL = "normal"
    PRIORITY = "priority"
    URGENT = "urgent"

    @property
    def label(self):
        return {
            "normal": "Normal",
            "priority": "Prioritário",
            "urgent": "Urgente",
        }[self.value]


class OperatorRole(str, Enum):
    ADMIN = "admin"
    ATTENDANT = "attendant"
    AUDITOR = "auditor"

    @property
    def label(self):
        return {
            "admin": "Administrador",
            "attendant": "Atendente",
            "auditor": "Auditor",
        }[self.value]


class AuditAction(str, Enum):
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
