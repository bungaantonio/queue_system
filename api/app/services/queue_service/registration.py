from typing import Tuple
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.crud.user.create import create_user
from app.crud.user.read import get_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.crud.biometric.create import create_biometric
from app.exceptions.exceptions import BiometricException
from app.models.biometric import Biometric
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


def _create_or_get_biometric(db: Session, user_id: int, biometric_model) -> Biometric:
    """
    Retorna a biometria existente do usuário ou cria uma nova.
    Garante unicidade global da biometria e evita IntegrityError.
    """
    # Verifica se o usuário já tem biometria
    existing_user_bio = db.query(Biometric).filter(Biometric.user_id == user_id).first()
    if existing_user_bio:
        return existing_user_bio

    # Verifica se a biometria já foi registrada por outro usuário
    existing_bio_global = (
        db.query(Biometric)
        .filter(Biometric.biometric_id == biometric_model.biometric_id)
        .first()
    )
    if existing_bio_global:
        raise BiometricException("biometric_already_registered")

    # Cria nova biometria
    biometric = Biometric(
        user_id=user_id,
        biometric_id=biometric_model.biometric_id,
    )
    db.add(biometric)
    db.flush()
    return biometric
