# app/crud/biometric/update.py
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.helpers.audit_helpers import audit_queue_action
from app.models.enums import AuditAction, QueueStatus
from app.models.queue_item import QueueItem


def mark_biometric_verified(
    db: Session, item: QueueItem, operator_id: int, biometric_id: int
) -> QueueItem:
    item.biometric_verified = True
    item.attempted_verification = True
    db.flush()

    audit_queue_action(
        db,
        action=AuditAction.QUEUE_VERIFIED,
        item=item,
        operator_id=operator_id,
        biometric_id=biometric_id,  # Importante: vincular qual ID foi lido
        details={"status": "sucesso"},
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
    """
    Marca o item como BEING_SERVED, garantindo que não haja outro ativo.
    """
    # Verifica se já existe algum atendimento ativo
    existing_active = (
        db.query(QueueItem).filter(QueueItem.status == QueueStatus.BEING_SERVED).first()
    )
    if existing_active:
        raise ValueError(
            f"Não é possível marcar {item.user_id} como BEING_SERVED: "
            f"usuário {existing_active.user_id} já está sendo atendido."
        )

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
