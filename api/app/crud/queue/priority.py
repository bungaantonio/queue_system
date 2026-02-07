from sqlalchemy import Enum, func
from sqlalchemy.orm import Session

from app.crud.queue.read import get_next_position
from app.helpers.audit_helpers import audit_queue_action
from app.models.enums import QueueStatus, AuditAction
from app.models.queue_item import QueueItem


def promote_priority(
    db: Session, item: QueueItem, increment: int = 1, operator_id: int | None = None
) -> QueueItem:
    """
    Aumenta a prioridade do item na fila.
    """
    old_priority = item.priority_score
    item.promote_priority(increment)
    db.commit()
    db.refresh(item)

    # Audita a mudança de prioridade
    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_PROMOTED,
        item=item,
        operator_id=operator_id,
        details={"old_priority": old_priority, "new_priority": item.priority_score},
    )
    return item


def demote_priority(
    db: Session, item: QueueItem, decrement: int = 1, operator_id: int | None = None
) -> QueueItem:
    """
    Reduz a prioridade do item na fila.
    """
    old_priority = item.priority_score
    item.demote_priority(decrement)
    db.commit()
    db.refresh(item)

    # Audita a mudança de prioridade
    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_DEMOTED,
        item=item,
        operator_id=operator_id,
        details={"old_priority": old_priority, "new_priority": item.priority_score},
    )
    return item


def reinsert_at_position(
    db: Session, item: QueueItem, position: int, operator_id: int | None = None
) -> QueueItem:
    """
    Move um item para uma nova posição na fila, ajustando os demais conforme necessário.
    """
    old_position = item.position
    max_position = get_next_position(db) - 1
    position = max(1, min(position, max_position))

    if position == old_position:
        return item

    # Itens ativos elegíveis para reposicionamento
    active_statuses = [QueueStatus.WAITING, QueueStatus.CALLED_PENDING]

    if position < old_position:
        # Move para cima: empurra os que estavam acima uma posição abaixo
        db.query(QueueItem).filter(
            QueueItem.position >= position,
            QueueItem.position < old_position,
            QueueItem.status.in_(active_statuses),
        ).update(
            {QueueItem.position: QueueItem.position + 1},
            synchronize_session="fetch",
        )
    else:
        # Move para baixo: puxa os que estavam abaixo uma posição acima
        db.query(QueueItem).filter(
            QueueItem.position <= position,
            QueueItem.position > old_position,
            QueueItem.status.in_(active_statuses),
        ).update(
            {QueueItem.position: QueueItem.position - 1},
            synchronize_session="fetch",
        )

    item.position = position

    # Audita a mudança de posição
    audit_queue_action(
        db,
        action=AuditAction.POSITION_CHANGED,
        item=item,
        operator_id=operator_id,
        details={"old_position": old_position, "new_position": position},
    )
    db.refresh(item)

    return item
