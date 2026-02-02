# app/services/queue_service/registration.py
from typing import Tuple
from sqlalchemy.orm import Session
from app.crud.user.create import create_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.exceptions.exceptions import BiometricException
from app.models.user_credential import UserCredential  # Nova Model
from app.models.queue_item import QueueItem
from app.schemas.queue_schema.request import QueueRegister
from app.services.biometric_service.utils import (
    hash_identifier,
)


def create_user_with_biometric_and_queue(
    db: Session, request: QueueRegister, operator_id: int
) -> Tuple[object, object, QueueItem]:
    """
    Fluxo de Cadastro: Cria usuário, gera credencial segura e entra na fila.
    """
    user_model, biometric_model = request.user, request.biometric

    # 1. Cria usuário (ou recupera se duplicado pelo document_id)
    db_user = create_user(db, user_model)

    # 2. Cria ou recupera a credencial híbrida (ZKTeco ou futuramente WebAuthn)
    db_cred = _create_or_get_credential(db, db_user.id, biometric_model)

    # 3. Garante item de fila ativo (Não passamos biometria para a fila!)
    queue_item = get_existing_queue_item(db, db_user.id)
    if not queue_item:
        queue_item = enqueue_user(
            db,
            user=db_user,
            operator_id=operator_id,
            attendance_type=request.attendance_type,
        )

    return db_user, db_cred, queue_item


def _create_or_get_credential(
    db: Session, user_id: int, biometric_model
) -> UserCredential:
    """
    Gerencia as credenciais do usuário. Aplica Hash HMAC no ID do sensor.
    """
    # 1. Gerar o hash seguro do ID vindo do sensor/middleware
    hashed_id = hash_identifier(biometric_model.biometric_id)

    # 2. Verifica se este usuário já tem esta digital cadastrada
    existing_user_cred = (
        db.query(UserCredential)
        .filter(
            UserCredential.user_id == user_id, UserCredential.identifier == hashed_id
        )
        .first()
    )
    if existing_user_cred:
        return existing_user_cred

    # 3. Segurança Global: Verifica se esta digital pertence a outra pessoa
    existing_global = (
        db.query(UserCredential).filter(UserCredential.identifier == hashed_id).first()
    )
    if existing_global:
        raise BiometricException("biometric_already_registered")

    # 4. Cria a nova credencial híbrida
    credential = UserCredential(
        user_id=user_id,
        cred_type="zkteco",  # Define que veio do hardware
        identifier=hashed_id,
    )
    db.add(credential)
    db.flush()
    return credential
