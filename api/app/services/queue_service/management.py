from typing import Optional
from app.crud.operator_crud import get_operator_by_id
from app.helpers.operators import check_permissions
from app.models.enums import AuditAction, OperatorRole
from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.helpers.audit_helpers import audit_queue_action, get_biometric_for_finished

from app.schemas.queue_schema.request import QueueRequeue
from app.schemas.queue_schema.response import (
    QueueConsult,
    QueueDetailItem,
    QueueCalledItem,
)

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
    get_called_pending_by_user_queue,
    get_existing_queue_item,
    has_active_service,
    get_next_waiting_item,
    get_active_service_item,
)
from app.services.audit_service import AuditService


def call_next_user(db: Session, operator_id: Optional[int] = None) -> QueueCalledItem:
    """
    Chama o próximo da fila. A biometria NÃO é tratada aqui.
    Apenas geramos o token de presença (call_token).
    """
    if has_active_service(db):
        raise QueueException("blocked_pending_verification")

    next_item = get_next_waiting_item(db)
    if not next_item:
        raise QueueException("empty")

    updated_item = mark_as_called(db, next_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_CALLED,
        item=updated_item,
        operator_id=operator_id,
        details={"msg": "Usuário chamado para o guichê"},
    )

    db.commit()
    return QueueCalledItem.from_orm_item(updated_item)


def complete_active_user_service(db: Session, operator_id: int) -> QueueDetailItem:
    current_item = get_active_service_item(db)
    if not current_item:
        raise QueueException("no_active_service")

    bio_id = get_biometric_for_finished(db, current_item.id)

    done_item = mark_as_done(db, current_item)

    audit_queue_action(
        db,
        action=AuditAction.QUEUE_PROCESSED,
        item=done_item,
        operator_id=operator_id,
        biometric_id=bio_id,
        details={"final_status": "DONE"},
    )

    db.commit()
    return QueueDetailItem.from_orm_item(done_item)


def skip_called_user(db: Session, current_operator_id: int) -> QueueDetailItem:
    """
    Pula o usuário chamado (pendente de verificação), movendo-o algumas posições abaixo.
    A lógica de reposicionamento está em `mark_as_skipped`.
    """

    current_item = get_pending_verification_item(db)
    if not current_item:
        raise QueueException("no_called_user")

    if current_item.attempted_verification:
        raise QueueException("user_attempted_verification")

    updated_item = mark_as_skipped(db, current_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_SKIPPED,
        item=updated_item,
        operator_id=current_operator_id,
        details={"reason": "Usuário não compareceu/biometria falhou"},
    )

    db.commit()
    return QueueDetailItem.from_orm_item(updated_item)


# Não usado, mas pode ser útil para auditoria ou para casos onde o usuário tenta verificar, mas não tem sucesso (tentativa de fraude, por exemplo)
def mark_user_verification_attempted(db: Session, user_id: int) -> None:
    """Marca que o usuário tentou verificação biométrica."""
    queue_item = get_called_pending_by_user_queue(db, user_id)
    if queue_item:
        verificated = mark_attempted_verification(db, queue_item)


def cancel_active_user(db: Session, item_id: int, operator_id) -> QueueDetailItem:
    """Cancela o atendimento do usuário ativo."""
    queue_item = get_existing_queue_item(db, item_id)
    if not queue_item:
        raise QueueException("no_active_user")

    cancelled_item = mark_as_cancelled(db, queue_item)

    audit_queue_action(
        db,
        action=AuditAction.USER_CANCELLED,
        item=cancelled_item,
        operator_id=operator_id,
        details={"item_id_cancelado": item_id},
    )

    db.commit()
    return QueueDetailItem.from_orm_item(cancelled_item)


def requeue_user_service(db, request: QueueRequeue, operator_id: int):
    """
    Reagenda o atendimento de um usuário, reinserindo-o na fila com base
    nas políticas de prioridade e SLA.
    """

    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise QueueException("operator_not_found")

    check_permissions(
        operator, allowed_roles=[OperatorRole.ATTENDANT, OperatorRole.ADMIN]
    )

    user = get_user(db, request.user_id)
    if not user:
        raise QueueException("user_not_found")

    queue_item = requeue_user(
        db,
        user=user,
        operator_id=operator_id,
        attendance_type=request.attendance_type,
    )

    db.commit()

    AuditService.log_action(
        db,
        user_id=operator_id,
        action=AuditAction.QUEUE_UPDATED,
        details={"queue_item_id": queue_item.id, "user_id": user.id},
    )

    return QueueConsult.from_queue_item(queue_item)
