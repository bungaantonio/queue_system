from enum import Enum

class QueueStatus(str, Enum):
    WAITING = "à espera"
    CALLED_PENDING = "chamado pendente"
    BEING_SERVED = "a ser atendido"
    DONE = "concluído"
    CANCELLED = "cancelado"
    SKIPPED = "ignorado"


class AttendanceType(str, Enum):
    NORMAL = "normal"
    PRIORITY = "prioritário"
    URGENT = "urgente"


class OperatorRole(str, Enum):
    ADMIN = "administrador"
    ATTENDANT = "atendente"
    AUDITOR = "auditor"


class AuditAction(str, Enum):
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
