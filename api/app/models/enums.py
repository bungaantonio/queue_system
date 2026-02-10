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
    SYSTEM = "system"

    @property
    def label(self):
        return {
            "admin": "Administrador",
            "attendant": "Atendente",
            "auditor": "Auditor",
        }[self.value]


class AuditAction(str, Enum):
    # Fila / Atendimento
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
    USER_CALLED = "Usuário chamado"
    USER_SKIPPED = "Usuário ignorado"
    USER_CANCELLED = "Usuário cancelado"

    # Biometria
    CREDENTIAL_CREATED = "Biometria criada"
    CREDENTIAL_UPDATED = "Biometria atualizada"
    CREDENTIAL_VERIFIED = "Biometria verificada"
    CREDENTIAL_FAILED = "Biometria falhada"

    # Utilizador / Utente
    USER_CREATED = "Usuário criado"
    USER_UPDATED = "Usuário atualizado"
    USER_ENQUEUED = "Usuário adicionado à fila"
    USER_REMOVED = "Usuário removido da fila"

    # Operador
    OPERATOR_CREATED = "Operador criado"
    OPERATOR_UPDATED = "Operador atualizado"
    OPERATOR_DEACTIVATED = "Operador desativado"

    # Auditoria / Sistema
    AUDIT_VERIFIED = "Cadeia de auditoria verificada"
    AUDIT_SUMMARY_GENERATED = "Resumo de auditoria gerado"
    PRIORITY_PROMOTED = "Prioridade promovida"
    PRIORITY_DEMOTED = "Prioridade rebaixada"
    POSITION_CHANGED = "Posição alterada"
