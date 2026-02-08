from typing import Optional

from sqlalchemy.orm import Session

from app.crud.queue.update import set_position, set_priority
from app.helpers.audit_helpers import audit_queue_action, build_audit_details
from app.models.enums import AuditAction
from app.models.queue_item import QueueItem


def promote_priority(
        db: Session,
        item: QueueItem,
        increment: int = 1,
        operator_id: Optional[int] = None
) -> QueueItem:
    """Aumenta a prioridade de um item na fila, com auditoria e commit."""
    old_priority = item.priority_score
    new_priority = old_priority + increment

    # Atualiza prioridade via CRUD
    item = set_priority(db, item, new_priority)

    # Auditoria
    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_PROMOTED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.PRIORITY_PROMOTED,
            status="success",
            msg="Prioridade aumentada",
            extra={"old_priority": old_priority, "new_priority": item.priority_score}
        )
    )

    db.commit()
    return item


def demote_priority(
        db: Session,
        item: QueueItem,
        decrement: int = 1,
        operator_id: Optional[int] = None
) -> QueueItem:
    """Reduz a prioridade de um item na fila, com auditoria e commit."""
    old_priority = item.priority_score
    new_priority = max(0, old_priority - decrement)

    item = set_priority(db, item, new_priority)

    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_DEMOTED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.PRIORITY_DEMOTED,
            status="success",
            msg="Prioridade reduzida",
            extra={"old_priority": old_priority, "new_priority": item.priority_score}
        )
    )

    db.commit()
    return item


def reinsert_at_position(
        db: Session,
        item: QueueItem,
        position: int,
        operator_id: Optional[int] = None
) -> QueueItem:
    """Move o item para nova posição, ajustando os demais e auditando."""
    old_position = item.position

    # Ajusta via CRUD
    item = set_position(db, item, position)

    audit_queue_action(
        db,
        action=AuditAction.POSITION_CHANGED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.POSITION_CHANGED,
            status="success",
            msg=f"Posição alterada de {old_position} para {position}",
            extra={"old_position": old_position, "new_position": position}
        )
    )

    db.commit()
    return item
