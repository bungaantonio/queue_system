from typing import Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.crud import (
    create_user,
    create_biometric,
    get_user,
    get_existing_queue_item,
    enqueue_user,
)
from app.helpers.logger import get_logger
from app.models.queue_item import QueueItem
from app.schemas.queue_schema.request import QueueRegister


logger = get_logger(__name__)


def create_user_with_biometric_and_queue(
    db: Session, request: QueueRegister, operator_id: int
) -> Tuple[object, object, QueueItem]:
    """
    Cria usuário, biometria e adiciona na fila.
    Retorna (db_user, db_bio, queue_item) — ENTIDADES ORM/DB.
    Não faz commit, permitindo controle de transação no endpoint chamador.
    """

    user_model, biometric_model = request.user, request.biometric

    # 1. Cria usuário (ou recupera se duplicado)
    db_user = create_user(db, user_model)
    logger.info(
        "Usuário criado ou recuperado: {db_user.id}",
        extra={"extra_data": {"user_id": db_user.id}},
    )

    # 2. Cria ou recupera biometria
    db_bio = _create_or_get_biometric(db, db_user.id, biometric_model)

    # 3. Garante item de fila ativo
    queue_item = get_existing_queue_item(db, db_user.id)
    if not queue_item:
        queue_item = enqueue_user(
            db,
            user=db_user,
            operator_id=operator_id,
            attendance_type=request.attendance_type,
        )
        logger.info(
            f"Usuário inserido na fila: {db_user.id}",
            extra={"extra_data": {"user_id": db_user.id, "operator_id": operator_id}},
        )
    else:
        logger.info(
            f"Usuário já possui item de fila ativo: {db_user.id}",
            extra={"extra_data": {"user_id": db_user.id}},
        )

    # Commit final será feito pelo endpoint/serviço chamador
    return db_user, db_bio, queue_item


def _create_or_get_biometric(db: Session, user_id: int, biometric_model) -> object:
    """
    Tenta criar biometria; se já existir, retorna a existente.
    """
    try:
        bio = create_biometric(
            db,
            user_id=user_id,
            biometric_id=biometric_model.biometric_id,
            finger_index=biometric_model.finger_index,
        )
        logger.info(
            f"Biometria criada para usuário: {user_id}",
            extra={
                "extra_data": {
                    "user_id": user_id,
                    "biometric_id": biometric_model.biometric_id,
                }
            },
        )
        return bio
    except IntegrityError:
        logger.warning(
            f"Tentativa de criar biometria duplicada para usuário: {user_id}",
            extra={
                "extra_data": {
                    "user_id": user_id,
                    "biometric_id": biometric_model.biometric_id,
                }
            },
        )
        # Nenhum rollback aqui; commit será controlado pelo chamador
        return get_user(db, user_id)
