from typing import Optional, List
from app.crud.credential_crud import get_by_identifier
from app.models.enums import AttendanceType
from app.utils.credential_utils import hash_identifier
from sqlalchemy.orm import Session

from app.crud.queue import (
    get_all_waiting,
    get_active_service_item,
    get_next_waiting_item,
    get_existing_queue_item,
    get_pending_verification_item,
    enqueue_user,
)
from app.models.queue_item import QueueItem
from app.core.exceptions import AppException
from app.helpers.audit_helpers import audit_log, build_audit_details


# 🔹 Consulta simples: cada função tem 1 responsabilidade
def get_served_user(db: Session) -> Optional[QueueItem]:
    """Usuário atualmente em atendimento (BEING_SERVED)."""
    return get_active_service_item(db)


def get_called_user(db: Session) -> Optional[QueueItem]:
    """Usuário chamado e pendente de verificação (CALLED_PENDING)."""
    return get_pending_verification_item(db)


def list_waiting_users(db: Session) -> list[type[QueueItem]]:
    """Lista todos os usuários em espera (WAITING)."""
    return get_all_waiting(db)


def get_user_queue_item(db: Session, user_id: int) -> QueueItem:
    """Retorna item de fila de um usuário ativo (WAITING, CALLED_PENDING, BEING_SERVED)."""
    item = get_existing_queue_item(db, user_id)
    if not item:
        raise AppException("user_not_in_queue")
    return item


def get_next_user_to_call(db: Session) -> Optional[QueueItem]:
    """Próximo usuário a ser chamado, considerando prioridade."""
    return get_next_waiting_item(db)


def quick_entry_user(
    db: Session,
    identifier: str,
    operator_id: int,
    attendance_type: AttendanceType.NORMAL,
) -> QueueItem:

    hashed_identifier = hash_identifier(identifier)
    credential = get_by_identifier(db, hashed_identifier)
    if not credential:
        raise AppException("credential.not_found")

    user = credential.user

    queue_item = get_existing_queue_item(db, user.id)
    if queue_item:
        return queue_item

    queue_item = enqueue_user(
        db,
        user=user,
        operator_id=operator_id,
        attendance_type=attendance_type,
    )

    audit_log(
        db,
        action="quick_entry",
        operator_id=operator_id,
        user_id=user.id,
        queue_item_id=queue_item.id,
        details=build_audit_details(
            action="quick_entry",
            msg="Usuário entrou rapidamente na fila",
            extra={"attendance_type": attendance_type},
        ),
    )

    return queue_item


def get_next_called_with_tokens(
    db: Session, operator_id: Optional[int] = None
) -> QueueItem:
    """Próximo usuário chamado pendente de verificação, retornando call_token e credential.
    Para uso apenas por clientes confiáveis (internos / backend)."""
    item = get_pending_verification_item(db)
    if not item:
        raise AppException("queue.no_called_user")

    audit_log(
        db,
        action="get_next_called_with_tokens",
        operator_id=operator_id,
        user_id=item.user_id,
        queue_item_id=item.id,
        details=build_audit_details(
            action="get_next_called_with_tokens",
            msg="get_next_called_with_tokens",
            extra={
                "credential": item.credential_verified,
                "call_token": item.call_token,
            },
        ),
    )
    return item
