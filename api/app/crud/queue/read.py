from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import asc, desc, func

from app.models.queue_item import QueueItem
from app.models.enums import QueueStatus


def get_queue_item(
    db: Session,
    user_id: int,
    status: QueueStatus
) -> Optional[QueueItem]:
    """Retorna o item de fila de um usuário por status."""
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.user_id == user_id, QueueItem.status == status)
        .first()
    )


def get_existing_queue_item(db: Session, user_id: int) -> Optional[QueueItem]:
    """Retorna item ativo do usuário (WAITING, CALLED_PENDING, BEING_SERVED)."""
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.user_id == user_id,
            QueueItem.status.in_([
                QueueStatus.WAITING,
                QueueStatus.CALLED_PENDING,
                QueueStatus.BEING_SERVED
            ])
        )
        .first()
    )


def get_all_waiting(db: Session) -> list[type[QueueItem]]:
    """Retorna todos os itens WAITING, ordenados por prioridade e posição."""
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.WAITING)
        .order_by(desc(QueueItem.priority_score), asc(QueueItem.position))
        .all()
    )


def get_next_waiting_item(db: Session) -> Optional[QueueItem]:
    """Retorna o próximo item a ser chamado (WAITING)."""
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.WAITING)
        .order_by(desc(QueueItem.priority_score), asc(QueueItem.position))
        .first()
    )


def get_active_service_item(db: Session) -> Optional[QueueItem]:
    """Retorna o item atualmente sendo atendido (BEING_SERVED)."""
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.BEING_SERVED)
        .first()
    )


def get_pending_verification_item(db: Session) -> Optional[QueueItem]:
    """Retorna item chamado e pendente de verificação (CALLED_PENDING)."""
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.CALLED_PENDING)
        .order_by(asc(QueueItem.position))
        .first()
    )


def get_next_position(db: Session) -> int:
    """Retorna próxima posição disponível na fila."""
    max_position = db.query(func.max(QueueItem.position)).scalar()
    return (max_position or 0) + 1


def has_active_service(db: Session) -> bool:
    """Retorna True se algum item estiver em atendimento ou chamado."""
    return (
        db.query(QueueItem)
        .filter(QueueItem.status.in_([QueueStatus.BEING_SERVED, QueueStatus.CALLED_PENDING]))
        .first()
        is not None
    )
