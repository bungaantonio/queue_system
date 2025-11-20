from typing import List, Optional
from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.crud import (
    get_user,
    get_all_waiting,
    get_user_by_id_number,
    get_user_by_phone,
    get_existing_queue_item,
    get_active_service_item,
    get_next_waiting_item,
    get_pending_verification_item,
)
from app.schemas.queue_schema.response import QueueDetailItem, QueueListItem


def get_user_queue_status_by_identity(
    db: Session, id_number: Optional[str] = None, phone: Optional[str] = None
) -> QueueDetailItem:
    """Consulta status do usuário via id_number ou phone."""
    if not id_number and not phone:
        raise QueueException("É necessário informar id_number ou phone.")

    user = (
        get_user_by_id_number(db, id_number)
        if id_number
        else get_user_by_phone(db, phone)
    )
    if not user:
        raise QueueException("user_not_found")

    queue_item = get_existing_queue_item(db, user.id)
    if not queue_item:
        return QueueDetailItem(
            id=0,
            position=None,
            status=None,
            timestamp=None,
            name=None,
            document_id=None,
            id_hint=None,
            phone=None,
            birth_date=None,
        )

    return QueueDetailItem.from_orm_item(queue_item)


def get_user_queue_status(db: Session, user_id: int) -> QueueDetailItem:
    """Retorna status atual do usuário na fila."""
    item = get_user(db, user_id)
    if not item:
        raise QueueException("user_not_in_queue")
    return QueueDetailItem.from_orm_item(item)


def get_active_user(db: Session) -> Optional[QueueDetailItem]:
    """Usuário atualmente em atendimento (BEING_SERVED)."""
    item = get_active_service_item(db)
    if not item:
        raise QueueException("no_active_service")
    return QueueDetailItem.from_orm_item(item)


def get_next_user_to_call(db: Session) -> Optional[QueueDetailItem]:
    """Próximo usuário a ser chamado (WAITING com maior prioridade)."""
    item = get_next_waiting_item(db)
    if not item:
        return None
    return QueueDetailItem.from_orm_item(item)


def list_waiting_and_called_items(db: Session) -> List[QueueListItem]:
    """Todos os itens WAITING ou CALLED_PENDING, mapeados para frontend."""
    waiting_items = get_all_waiting(db)
    pending_item = get_pending_verification_item(db)

    queue_items = waiting_items + ([pending_item] if pending_item else [])
    return [QueueListItem.from_orm_item(item) for item in queue_items]


def get_pending_verification_user(db: Session) -> QueueDetailItem:
    """Usuário chamado, pendente de verificação biométrica."""
    item = get_pending_verification_item(db)
    if not item:
        raise QueueException("no_called_user")
    return QueueDetailItem.from_orm_item(item)
