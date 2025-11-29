from typing import Sequence, Optional
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session, joinedload

from app.models.enums import QueueStatus
from app.models.queue_item import QueueItem


def get_queue_item(
    db: Session,
    user_id: int,
    status: QueueStatus = QueueStatus.WAITING,
) -> Optional[QueueItem]:
    """
    Retorna o item ativo de um usuário na fila, se existir.
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(
            QueueItem.user_id == user_id,
            QueueItem.status == status,
        )
        .first()
    )


def get_queue(db: Session) -> Sequence[QueueItem]:
    """
    Retorna todos os itens da fila, com os dados do usuário carregados.
    """
    return db.query(QueueItem).options(joinedload(QueueItem.user)).all()


def get_by_user(db: Session, user_id: int) -> Optional[QueueItem]:
    """
    Retorna o item da fila associado a um usuário específico (qualquer status).
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.user_id == user_id)
        .first()
    )


def get_existing_queue_item(db: Session, item_id: int) -> Optional[QueueItem]:
    """
    Verifica se o usuário já possui um item ativo na fila.
    Considera os status de espera e atendimento em curso.
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.id == item_id,
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


def get_active_service_item(db: Session) -> Optional[QueueItem]:
    """
    Retorna o item atualmente sendo atendido (status BEING_SERVED).
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.BEING_SERVED)
        .first()
    )


def get_called_pending_by_user_queue(db: Session, user_id: int) -> Optional[QueueItem]:
    """
    Retorna o item da fila do usuário que está em status CALLED_PENDING.
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.user_id == user_id,
            QueueItem.status == QueueStatus.CALLED_PENDING,
        )
        .first()
    )


def get_all_waiting(db: Session) -> Sequence[QueueItem]:
    """
    Retorna todos os cidadãos que estão na fila de espera (WAITING),
    ordenados por prioridade (desc) e posição (asc).
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.WAITING)
        .order_by(desc(QueueItem.priority_score), asc(QueueItem.position))
        .all()
    )


def get_next_waiting_item(db: Session) -> Optional[QueueItem]:
    """
    Retorna o próximo item da fila, considerando prioridade e ordem.
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == QueueStatus.WAITING)
        .order_by(desc(QueueItem.priority_score), asc(QueueItem.position))
        .first()
    )


def has_active_service(db: Session) -> bool:
    """
    Retorna True se houver algum item sendo atendido ou chamado.
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.status.in_([QueueStatus.BEING_SERVED, QueueStatus.CALLED_PENDING])
        )
        .first()
        is not None
    )


def get_pending_verification_item(db: Session) -> Optional[QueueItem]:
    """
    Retorna o item que está chamado e pendente de verificação (CALLED_PENDING),
    assumindo que só existe um por vez.
    """
    return (
        db.query(QueueItem)
        .filter(QueueItem.status == QueueStatus.CALLED_PENDING)
        .order_by(asc(QueueItem.position))
        .first()
    )
