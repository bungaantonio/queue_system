# app/services/queue_service/registration.py
from typing import Tuple
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.crud.user.create import create_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.exceptions.exceptions import BiometricException, QueueException
from app.models.user import User
from app.models.user_credential import UserCredential  # Nova Model
from app.models.queue_item import QueueItem
from app.schemas.queue_schema.request import QueueRegister
from app.services.biometric_service.utils import (
    hash_identifier,
)


def create_user_with_biometric_and_queue(db, request, operator_id):
    # Verifica se usuário já existe
    user_exists = (
        db.query(User).filter(User.id_number == request.user.document_id).first()
    )
    if user_exists:
        raise QueueException("user_already_registered")

    # Criação do usuário
    db_user = create_user(db, request.user)

    # Verifica biometria
    db_cred = _create_or_get_credential(db, db_user.id, request.biometric)

    # Verifica fila
    queue_item = get_existing_queue_item(db, db_user.id)
    if queue_item:
        raise QueueException("user_already_in_queue")

    # Cria item de fila se não existir
    if not queue_item:
        queue_item = enqueue_user(db, db_user, operator_id, request.attendance_type)

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
