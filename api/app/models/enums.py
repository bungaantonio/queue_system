from enum import Enum

class QueueStatus(str, Enum):
    WAITING = "À espera"
    CALLED_PENDING = "Chamado pendente"
    BEING_SERVED = "A ser atendido"
    DONE = "Concluído"
    CANCELLED = "Cancelado"
    SKIPPED = "Ignorado"

class AttendanceType(str, Enum):
    NORMAL = "Normal"
    PRIORITY = "Prioritário"
    URGENT = "Urgente"


class OperatorRole(str, Enum):
    ADMIN = "Administrador"
    ATTENDANT = "Atendente"
    AUDITOR = "Auditor"


class AuditAction(str, Enum):
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
