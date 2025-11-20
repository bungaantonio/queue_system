from enum import Enum


class QueueStatus(str, Enum):
    WAITING = "waiting"
    CALLED_PENDING = "called_pending_verification"
    BEING_SERVED = "being_served"
    DONE = "done"
    CANCELLED = "cancelled"
    SKIPPED = "skipped"


class AttendanceType(str, Enum):
    NORMAL = "normal"
    PRIORITY = "priority"
    URGENT = "urgent"


class OperatorRole(str, Enum):
    ADMIN = "admin"
    ATTENDANT = "attendant"
    AUDITOR = "auditor"


class AuditAction(str, Enum):
    QUEUE_CREATED = "QUEUE_CREATED"
    QUEUE_UPDATED = "QUEUE_UPDATED"
    QUEUE_VERIFIED = "QUEUE_VERIFIED"
    QUEUE_PROCESSED = "QUEUE_PROCESSED"
