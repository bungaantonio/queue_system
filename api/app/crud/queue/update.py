# app/crud/queue/update.py
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.crud.queue.read import get_next_position
from app.models.enums import QueueStatus
from app.models.queue_item import QueueItem
from app.models.user_credential import UserCredential
from app.utils import credential_utils


def set_priority(db: Session, item: QueueItem, new_priority: int) -> QueueItem:
    item.priority_score = new_priority

    db.flush()
    return item


def set_position(db: Session, item: QueueItem, new_position: int) -> QueueItem:
    old_position = item.position
    if old_position == new_position:
        return item

    active_statuses = [QueueStatus.WAITING, QueueStatus.CALLED_PENDING]

    if new_position < old_position:
        db.query(QueueItem).filter(
            QueueItem.position >= new_position,
            QueueItem.position < old_position,
            QueueItem.status.in_(active_statuses)
        ).update({QueueItem.position: QueueItem.position + 1}, synchronize_session="fetch")
    else:
        # desce o item: puxa os abaixo uma posição acima
        db.query(QueueItem).filter(
            QueueItem.position <= new_position,
            QueueItem.position > old_position,
            QueueItem.status.in_(active_statuses)
        ).update({QueueItem.position: QueueItem.position - 1}, synchronize_session="fetch")

    item.position = new_position

    db.flush()
    return item


def mark_as_called(db: Session, item: QueueItem) -> QueueItem:
    item.status = QueueStatus.CALLED_PENDING
    item.timestamp = datetime.now(timezone.utc)

    item.reset_authentication_state()

    # Gera token de chamada
    item.call_token, item.call_token_expires_at = (
        credential_utils.generate_call_token()
    )

    # Buscar a credencial física (Opcional)
    credential = (
        db.query(UserCredential)
        .filter(
            UserCredential.user_id == item.user_id, UserCredential.cred_type == "zkteco"
        )
        .first()
    )

    if credential:
        item.credential = credential.identifier

    db.flush()
    return item


def mark_as_done(db: Session, item: QueueItem) -> QueueItem:
    item.status = QueueStatus.DONE
    item.timestamp = datetime.now(timezone.utc)

    db.flush()
    return item


def mark_as_cancelled(db: Session, item: QueueItem) -> QueueItem:
    old_position = item.position

    item.status = QueueStatus.CANCELLED
    item.reset_authentication_state()

    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )

    db.flush()
    return item


def mark_as_skipped(
        db: Session,
        item: QueueItem,
        offset: int = 2,
) -> QueueItem:
    old_position = item.position

    max_position = get_next_position(db) - 1
    new_position = min(old_position + offset, max_position)

    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.position <= new_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )

    item.status = QueueStatus.WAITING
    item.position = new_position
    item.timestamp = datetime.now(timezone.utc)

    db.flush()
    return item


def mark_attempted_verification(db: Session, item: QueueItem) -> QueueItem:
    item.attempted_verification = True

    db.flush()
    return item
