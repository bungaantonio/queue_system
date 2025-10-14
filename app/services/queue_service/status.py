from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app.crud import queue_crud
from app.exceptions.exceptions import QueueException
from app.helpers import biometric_helpers
from app.helpers.queue_helpers import map_to_queue_detail, map_to_queue_list


def list_waiting_and_called_items(db: Session) -> list[dict]:
    """
    Retorna todos os itens da fila com status 'waiting' ou 'called_pending_verification',
    mapeados para o formato resumido do frontend.
    """
    queue_orm = queue_crud.get_waiting_and_called(db)
    return [map_to_queue_list(item) for item in queue_orm if item]


def get_active_queue_item(db: Session) -> Optional[dict]:
    """
    Retorna o item de fila atualmente em atendimento, se houver.
    """
    current = queue_crud.get_active_item(db)
    if not current:
        raise QueueException("no_active_service")
    return map_to_queue_detail(current) if current else None


def get_pending_verification_item(db: Session) -> Optional[dict]:
    """
    Retorna o item de fila que foi chamado, mas ainda aguarda verificação biométrica.
    """
    called = queue_crud.get_pending_verification_item(db)
    if not called:
        raise QueueException("no_called_user")
    return map_to_queue_detail(called) if called else None


def process_biometric_scan(db: Session, biometric_id: str) -> dict:
    """
    Processa a leitura biométrica:
    - Identifica o usuário pelo template biométrico.
    - Se estiver 'called_pending_verification', muda para 'being_served'.
    - Se não estiver na fila, é inserido no fim.
    """
    user_id = biometric_helpers.identify_user(db, biometric_id)
    queue_item = queue_crud.get_active_queue_item_by_user(db, user_id)

    if queue_item:
        if queue_item.status == "called_pending_verification":
            queue_item.status = "being_served"
            queue_item.timestamp = datetime.now(timezone.utc)
            db.commit()
            db.refresh(queue_item)
    else:
        queue_item = queue_crud.insert_user_at_end(db, user_id)

    return map_to_queue_detail(queue_item)
