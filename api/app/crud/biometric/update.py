from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.helpers.audit_helpers import audit_queue_action
from app.models.enums import AuditAction, QueueStatus
from app.models.queue_item import QueueItem


def mark_biometric_verified(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    item.biometric_verified = True
    item.attempted_verification = True
    db.flush()
    audit_queue_action(
        db,
        AuditAction.QUEUE_VERIFIED,
        item,
        operator_id,
        f"biometric_verified: user_id={item.user_id}, status={item.status}",
    )
    return item


def mark_biometric_attempt(
    db: Session, queue_item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    queue_item.attempted_verification = True
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_VERIFIED,
        queue_item,
        operator_id,
        f"biometric_attempted: user_id={queue_item.user_id}, status={queue_item.status}",
    )
    return queue_item


def mark_as_being_served(db: Session, item: QueueItem, operator_id: int) -> QueueItem:
    old_status = item.status
    item.status = QueueStatus.BEING_SERVED
    item.timestamp = datetime.now(timezone.utc)
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_being_served: {old_status} -> {item.status}",
    )
    return item
