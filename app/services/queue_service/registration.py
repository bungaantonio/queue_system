from typing import Tuple
from sqlalchemy.orm import Session

from app.crud import biometric_crud, queue_crud, user_crud
from app.models.queue_item import QueueItem
from app.schemas.queue_schema import QueueRegisterRequest


def create_user_with_biometric_and_queue(
    db: Session, request: QueueRegisterRequest
) -> Tuple[object, object, QueueItem]:
    """
    Cria usuário, biometria e adiciona na fila.
    Retorna (db_user, db_bio, queue_item) — ENTIDADES ORM/DB, sem DTO.
    """
    user_model, biometric_model = request.user, request.biometric

    db_user = user_crud.create_user(db, user_model)

    db_bio = biometric_crud.create_biometric(
        db,
        user_id=db_user.id,
        biometric_id=biometric_model.biometric_id,
        finger_index=biometric_model.finger_index,
    )

    queue_item = queue_crud.get_queue_item(db, db_user.id)

    return db_user, db_bio, queue_item
