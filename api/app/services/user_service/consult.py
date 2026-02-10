from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.queue_item import QueueItem
from app.models.enums import QueueStatus


def get_existing_user_item(db: Session, user_id: int) -> Optional[QueueItem]:
    """
    Verifica se o usuário já possui um item ativo na fila.
    Considera os status de espera e atendimento em curso.
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.id == user_id,
            QueueItem.status.in_(
                [
                    QueueStatus.WAITING,
                    QueueStatus.CALLED_PENDING,
                    QueueStatus.BEING_SERVED,
                ]
            ),
        )
        .first()
    )
