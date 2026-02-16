from sqlalchemy.orm import Session
from typing import Any, Optional, cast

from app.core.exceptions import AppException
from app.models.enums import AuditAction, QueueStatus

from app.crud.operator_crud import get_operator_by_id
from app.crud.user.read import get_user
from app.crud.queue.create import requeue_user
from app.crud.queue.update import (
    mark_as_called,
    mark_as_skipped,
    mark_as_done,
    mark_as_cancelled,
    mark_attempted_verification,
)
from app.crud.queue.read import (
    get_pending_verification_item,
    get_queue_item_by_id,
    has_active_service,
    get_next_waiting_item,
    get_active_service_item, get_next_position,
)
from app.helpers.audit_helpers import (
    audit_queue_action,
    get_last_verification_credential_for_queue_item,
    build_audit_details,
    audit_queue_requeued,
)
from app.models.queue_item import QueueItem

from app.schemas.queue_schema.request import QueueRequeue


def call_next_user(db: Session, operator_id: Optional[int] = None) -> QueueItem:
    """ Chama o próximo da fila (gera call_token). """
    if has_active_service(db):
        raise AppException("queue.pending_verification_exists")

    next_item = get_next_waiting_item(db)
    if not next_item:
        raise AppException("queue.empty")

    updated_item = mark_as_called(db, next_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_CALLED,
        item=updated_item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.USER_CALLED,
            msg="Usuário chamado para o guichê",
        ),
    )

    db.commit()
    return updated_item


def complete_active_user_service(db: Session, operator_id: int) -> QueueItem:
    current_item = get_active_service_item(db)
    if not current_item:
        raise AppException("queue.no_active_service")

    bio_id = get_last_verification_credential_for_queue_item(
        db, cast(int, current_item.id)
    )

    done_item = mark_as_done(db, current_item)

    audit_queue_action(
        db,
        action=AuditAction.QUEUE_PROCESSED,
        item=done_item,
        operator_id=operator_id,
        credential_id=bio_id,
        details=build_audit_details(
            action=AuditAction.QUEUE_PROCESSED,
            msg="Atendimento concluído",
            extra={"final_status": "DONE"},
        ),
    )

    db.commit()
    return done_item


def skip_called_user(db: Session, current_operator_id: int) -> QueueItem:
    """
    Pula o utilizador chamado (pendente de verificação), movendo-o algumas posições abaixo.
    A lógica de reposicionamento está em 'mark_as_skipped'.
    """

    current_item = get_pending_verification_item(db)
    if not current_item:
        raise AppException("queue.item_not_called")

    if cast(bool, current_item.attempted_verification):
        raise AppException("queue.user_attempted_verification")

    updated_item = mark_as_skipped(db, current_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_SKIPPED,
        item=updated_item,
        operator_id=current_operator_id,
        details=build_audit_details(
            action=AuditAction.USER_SKIPPED,
            msg="Usuário ignorado",
            extra={"reason": "Usuário não compareceu/biometria falhou"},
        ),
    )

    db.commit()
    return updated_item


# Não usado, mas pode ser útil para auditoria ou para casos onde o utilizador tenta verificar, mas não tem sucesso (tentativa de fraude, por exemplo)
def mark_user_verification_attempted(db: Session, user_id: int) -> None:
    """Marca que o utilizador tentou verificação biométrica."""
    queue_item = get_pending_verification_item(db)
    if not queue_item:
        return

    if cast(int, queue_item.user_id) == user_id:
        mark_attempted_verification(db, queue_item)
        db.commit()


def cancel_active_user(db: Session, item_id: int, operator_id: int) -> QueueItem:
    """Cancela o atendimento do utilizador ativo."""
    queue_item = get_queue_item_by_id(db, item_id)
    if not queue_item:
        raise AppException("queue.no_active_user")

    cancelled_item = mark_as_cancelled(db, queue_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_CANCELLED,
        item=cancelled_item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.USER_CANCELLED,
            msg="Atendimento cancelado",
            extra={"item_id_cancelado": item_id},
        ),
    )

    db.commit()
    return cancelled_item


def requeue_user_service(
    db: Session, request: QueueRequeue, operator_id: int
) -> QueueItem:
    """
    Reagenda o atendimento de um utilizador, reinserindo-o na fila com base
    nas políticas de prioridade e SLA.
    """

    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise AppException("operator.not_found")

    user = get_user(db, request.user_id)
    if not user:
        raise AppException("user.not_found")

    queue_item = requeue_user(
        db,
        user=user,
        operator_id=operator_id,
        attendance_type=request.attendance_type,
    )

    audit_queue_requeued(
        db,
        operator_id=operator_id,
        item=queue_item,
        attendance_type=request.attendance_type,
    )
    db.commit()

    return queue_item


def promote_priority(db: Session, item: QueueItem, increment: int = 1, operator_id: int | None = None) -> QueueItem:
    old_priority = item.priority_score
    item.promote_priority(increment)  # altera o objeto, mas não commita

    # Auditoria
    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_PROMOTED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.PRIORITY_PROMOTED,
            status="success",
            msg="Prioridade alterada",
            extra={"old_priority": old_priority, "new_priority": item.priority_score}
        )
    )

    db.commit()  # commit final do serviço
    db.refresh(item)
    return item


def demote_priority(db: Session, item: QueueItem, decrement: int = 1, operator_id: int | None = None) -> QueueItem:
    old_priority = item.priority_score
    item.demote_priority(decrement)

    audit_queue_action(
        db,
        action=AuditAction.PRIORITY_DEMOTED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.PRIORITY_DEMOTED,
            status="success",
            msg="Prioridade alterada",
            extra={"old_priority": old_priority, "new_priority": item.priority_score}
        )
    )

    db.commit()
    db.refresh(item)
    return item


def reinsert_at_position(db: Session, item: QueueItem, position: int, operator_id: int | None = None) -> QueueItem:
    old_position = cast(int, item.position)
    max_position = get_next_position(db) - 1
    position = max(1, min(position, max_position))

    if position == old_position:
        return item

    active_statuses = [QueueStatus.WAITING, QueueStatus.CALLED_PENDING]

    if position < old_position:
        db.query(QueueItem).filter(
            QueueItem.position >= position,
            QueueItem.position < old_position,
            QueueItem.status.in_(active_statuses),
        ).update({QueueItem.position: QueueItem.position + 1}, synchronize_session="fetch")
    else:
        db.query(QueueItem).filter(
            QueueItem.position <= position,
            QueueItem.position > old_position,
            QueueItem.status.in_(active_statuses),
        ).update({QueueItem.position: QueueItem.position - 1}, synchronize_session="fetch")

    cast(Any, item).position = position

    audit_queue_action(
        db,
        action=AuditAction.POSITION_CHANGED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.POSITION_CHANGED,
            status="success",
            msg=f"Posição alterada de {old_position} para {position}",
            extra={"old_position": old_position, "new_position": position},
        )
    )

    db.commit()
    db.refresh(item)
    return item
