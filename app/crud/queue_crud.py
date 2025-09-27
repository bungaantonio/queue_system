from datetime import datetime, timezone
from typing import Optional, Sequence
from sqlalchemy import func, asc
from sqlalchemy.orm import Session, joinedload
from app.models.queue_item import QueueItem


# ------------------- Inserção genérica -------------------
def _insert_at_end(db: Session, user_id: int, status: str = "waiting") -> QueueItem:
    """
    Insere um usuário no final da fila com o status informado.
    Reuso para create, insert e reinsert.
    """
    max_position = db.query(func.max(QueueItem.position)).scalar() or 0
    item = QueueItem(
        user_id=user_id,
        status=status,
        position=max_position + 1,
        timestamp=datetime.now(timezone.utc),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ------------------- CRUD público -------------------
def create_queue_item(db: Session, user_id: int, status: str = "waiting") -> QueueItem:
    """
    Cria um QueueItem, reaproveitando se já existir ativo.
    """
    existing = get_active_queue_item_by_user(db, user_id)
    if existing:
        return existing
    return _insert_at_end(db, user_id, status)


def get_queue(db: Session) -> Sequence[QueueItem]:
    return db.query(QueueItem).all()


def get_by_user(db: Session, user_id: int) -> Optional[QueueItem]:
    return db.query(QueueItem).filter(QueueItem.user_id == user_id).first()


def get_active_queue_item_by_user(db: Session, user_id: int) -> Optional[QueueItem]:
    """
    Retorna item ativo do usuário (waiting, called_pending_verification ou being_served)
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.user_id == user_id,
            QueueItem.status.in_(
                ["waiting", "called_pending_verification", "being_served"]
            ),
        )
        .first()
    )


def get_all_waiting(db: Session) -> Sequence[QueueItem]:
    """
    Retorna todos os itens com status 'waiting', ordenados por posição.
    """
    return (
        db.query(QueueItem)
        .filter(QueueItem.status == "waiting")
        .order_by(asc(QueueItem.position))
        .all()
    )


def get_waiting_and_called(db: Session) -> Sequence[QueueItem]:
    """
    Retorna itens com status 'waiting' ou 'called_pending_verification',
    incluindo dados do usuário relacionados.
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status.in_(["waiting", "called_pending_verification"]))
        .order_by(QueueItem.position.asc())
        .all()
    )


def get_next_waiting_item(db: Session) -> Optional[QueueItem]:
    """
    Retorna o próximo item 'waiting', ordenado por posição.
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == "waiting")
        .order_by(QueueItem.position.asc())
        .first()
    )


def get_current_being_served(db: Session) -> Optional[QueueItem]:
    """
    Retorna o usuário atualmente em atendimento.
    """
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter(QueueItem.status == "being_served")
        .first()
    )


def get_called_pending_by_user(db: Session, user_id: int) -> Optional[QueueItem]:
    """
    Retorna o QueueItem de um usuário em 'called_pending_verification'.
    """
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.user_id == user_id,
            QueueItem.status == "called_pending_verification",
        )
        .first()
    )


def get_called_pending(db: Session) -> Optional[QueueItem]:
    """
    Retorna o próximo usuário aguardando verificação biométrica.
    """
    return db.query(QueueItem).filter(QueueItem.status == "called_pending_verification").first()


def has_active_service(db: Session) -> bool:
    """
    Verifica se existe alguém sendo atendido ou aguardando verificação.
    """
    return (
        db.query(QueueItem)
        .filter(QueueItem.status.in_(["being_served", "called_pending_verification"]))
        .first()
        is not None
    )


# ------------------- Atualizações -------------------
def mark_as_called(db: Session, item: QueueItem) -> QueueItem:
    """
    Atualiza o item para 'called_pending_verification'.
    """
    item.status = "called_pending_verification"
    item.attempted_verification = False
    item.timestamp = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return item


def mark_as_done(db: Session, item: QueueItem) -> QueueItem:
    """
    Atualiza o status do usuário em atendimento para 'done'.
    """
    item.status = "done"
    item.timestamp = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return item


def mark_as_skipped(db: Session, item: QueueItem) -> QueueItem:
    """
    Marca um item existente como 'skipped'.
    """
    item.status = "skipped"
    db.commit()
    db.refresh(item)
    return item


def reinsert_user_at_end(db: Session, user_id: int) -> QueueItem:
    """
    Cria um novo registro no final da fila ('waiting').
    """
    return _insert_at_end(db, user_id, "waiting")


def insert_user_at_end(db: Session, user_id: int) -> QueueItem:
    """
    Alias para inserção de usuário no fim da fila.
    """
    return _insert_at_end(db, user_id, "waiting")
