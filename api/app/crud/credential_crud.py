# app/crud/credential_crud.py

from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.user_credential import UserCredential
from app.models.queue_item import QueueItem
from app.models.enums import QueueStatus


def get_called_pending_by_queue_item_id(
    db: Session, queue_item_id: int
) -> QueueItem | None:
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.id == queue_item_id,
            QueueItem.status == QueueStatus.CALLED_PENDING,
        )
        .first()
    )


def get_by_identifier(db: Session, identifier: str) -> UserCredential | None:
    return (
        db.query(UserCredential).filter(UserCredential.identifier == identifier).first()
    )


def get_user_id_by_identifier(
    db: Session,
    identifier: str,
) -> int | None:
    credential = get_by_identifier(db, identifier)
    return credential.user_id if credential else None


def get_first_credential_by_user(db: Session, user_id: int) -> UserCredential | None:
    return (
        db.query(UserCredential)
        .filter(UserCredential.user_id == user_id)
        .order_by(UserCredential.id.asc())
        .first()
    )


def create_credential(db: Session, user_id: int, identifier: str) -> UserCredential:
    credential = UserCredential(user_id=user_id, identifier=identifier)
    db.add(credential)
    db.flush()
    return credential


def mark_credential_attempt(db: Session, item: QueueItem) -> None:
    item.attempted_verification = True
    db.flush()


def mark_credential_verified(db: Session, item: QueueItem) -> None:
    item.credential_verified = True
    item.attempted_verification = True
    db.flush()


def set_being_served(db: Session, item: QueueItem) -> None:
    item.status = QueueStatus.BEING_SERVED
    item.timestamp = datetime.now(timezone.utc)
    db.flush()


def get_active_being_served(db: Session) -> QueueItem | None:
    return (
        db.query(QueueItem).filter(QueueItem.status == QueueStatus.BEING_SERVED).first()
    )
