from typing import Optional
from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.helpers.audit_helpers import get_biometric_for_finished
from app.helpers.queue_helpers import map_to_queue_detail

from app.models.enums import QueueStatus
from app.schemas.queue_schema.response import (
    QueueConsult,
    QueueDetailItem,
    QueueCalledItem,
)
from app.crud.queue_crud import consult, insert, update

from app.crud.user_crud import get_user


def call_next_user(db: Session, operator_id: Optional[int] = None) -> QueueCalledItem:
    """Chama o próximo usuário da fila, considerando prioridade."""
    if consult.has_active_service(db):
        raise QueueException("blocked_pending_verification")

    next_item = consult.get_next_waiting_item(db)
    if not next_item:
        raise QueueException("empty")

    updated_item = update.mark_as_called(db, next_item, operator_id=operator_id)

    db.flush()

    return QueueCalledItem.from_orm_item(updated_item)


def complete_active_user_service(db: Session) -> QueueDetailItem:
    """Conclui o atendimento do usuário ativo."""
    current_item = consult.get_active_service_item(db)
    if not current_item:
        raise QueueException("no_active_service")

    done_item = update.mark_as_done(db, current_item)
    _ = get_biometric_for_finished(db, done_item.id)

    return QueueDetailItem.from_orm_item(done_item)


def skip_called_user(db: Session) -> QueueDetailItem:
    """
    Pula o usuário chamado (pendente de verificação), movendo-o algumas posições abaixo.
    A lógica de reposicionamento está em `update.mark_as_skipped`.
    """
    current_item = consult.get_pending_verification_item(db)
    if not current_item:
        raise QueueException("no_called_user")

    if current_item.attempted_verification:
        raise QueueException("user_attempted_verification")

    updated_item = update.mark_as_skipped(db, current_item)
    return QueueDetailItem.from_orm_item(updated_item)


def mark_user_verification_attempted(db: Session, user_id: int) -> None:
    """Marca que o usuário tentou verificação biométrica."""
    queue_item = consult.get_called_pending_by_user(db, user_id)
    if queue_item:
        update.mark_attempted_verification(db, queue_item)


def cancel_active_user(db: Session, user_id: int) -> QueueDetailItem:
    """Cancela o atendimento do usuário ativo."""
    queue_item = consult.get_existing_queue_item(db, user_id)
    if not queue_item:
        raise QueueException("no_active_user")

    cancelled_item = update.mark_as_cancelled(db, queue_item)
    return map_to_queue_detail(cancelled_item)


def requeue_user_service(db, request):
    """
    Reagenda o atendimento de um usuário, reinserindo-o na fila com base
    nas políticas de prioridade e SLA.
    """
    user = get_user(db, request.user_id)
    if not user:
        raise QueueException("user_not_found")

    queue_item = insert.requeue_user(
        db,
        user=user,
        operator_id=request.operator_id,
        attendance_type=request.attendance_type,
    )

    return QueueConsult.from_queue_item(queue_item)
