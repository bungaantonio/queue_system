from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.user.read import get_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.models.user_credential import UserCredential
from app.exceptions.exceptions import BiometricException, QueueException
from app.services.biometric_service.utils import hash_identifier
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
from app.helpers.audit_helpers import audit_log
from app.schemas.queue_schema.response import (
    QueueDetailItem,
    QueueListItem,
    QueueCalledItem,
    QuickEntryResponse,
)


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


def get_next_called_with_tokens(
    db: Session, operator_id: Optional[int] = None
) -> QueueCalledItem:
    """
    Próximo usuário chamado pendente de verificação, retornando call_token e biometric_hash.
    Para uso apenas por clientes confiáveis (internos / backend).
    """
    item = get_pending_verification_item(db)
    if not item:
        raise QueueException("no_called_user")

    audit_log(
        db,
        action="get_next_called_with_tokens",
        operator_id=operator_id,
        user_id=item.user_id,
        queue_item_id=item.id,
        details={"call_token": item.call_token, "biometric_hash": item.biometric_hash},
    )

    return QueueCalledItem.from_orm_item(item)


def quick_entry(
    db: Session, request, biometric_id: str, operator_id: Optional[int] = None
) -> QuickEntryResponse:

    # 1. Aplica hash ao ID da biometria
    hashed_id = hash_identifier(biometric_id)

    # 2. Busca usuário pelo hash
    cred = (
        db.query(UserCredential).filter(UserCredential.identifier == hashed_id).first()
    )
    if not cred:
        raise BiometricException("biometric_not_found")

    user = get_user(db, cred.user_id)
    if not user:
        raise QueueException("user_not_found")

    # 3. Verifica se o usuário já está na fila
    queue_item = get_existing_queue_item(db, user.id)
    if queue_item:
        # Retorna o item existente (idempotente)
        return QuickEntryResponse.from_orm_item(queue_item)

    # 4. Se não estiver na fila, adiciona
    queue_item = enqueue_user(
        db,
        user=user,
        operator_id=operator_id or 1,  # ID padrão do sistema/totem
        attendance_type=request.attendance_type,
    )

    return QuickEntryResponse.from_orm_item(queue_item)
