from typing import Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.crud.user.create import create_user
from app.crud.user.read import get_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.crud.biometric.create import create_biometric
from app.models.queue_item import QueueItem
from app.schemas.queue_schema.request import QueueRegister


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

    # Commit final será feito pelo endpoint/serviço chamador
    return db_user, db_bio, queue_item


def _create_or_get_biometric(db: Session, user_id: int, biometric_model) -> object:
    """
    Tenta criar biometria; se já existir, retorna a existente.
    """
    try:
        return create_biometric(
            db,
            user_id=user_id,
            biometric_id=biometric_model.biometric_id,
            finger_index=biometric_model.finger_index,
        )
    except IntegrityError:
        # Nenhum rollback aqui; commit será controlado pelo chamador
        # Verificar depois se deve retornar que tipo de _user
        # Tem um get_by_user em queue_crud
        return get_user(db, user_id)
