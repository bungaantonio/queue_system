# app/services/queue_service/registration.py
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.crud.user.create import create_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item

from app.models.enums import AuditAction, QueueStatus
from app.models.user import User
from app.models.user_credential import UserCredential

from app.utils.credential_utils import hash_identifier
from app.helpers.audit_helpers import audit_queue_action



def create_user_with_biometric_and_queue(db, request, operator_id):
    # Verifica se utilizador já existe
    user_exists = (
        db.query(User).filter(User.id_number == request.user.document_id).first()
    )
    if user_exists:
        raise AppException("queue.user_already_registered")

    # Criação do utilizador
    db_user = create_user(db, request.user, operator_id=operator_id)

    # Verifica biometria
    db_cred = _create_or_get_credential(db, db_user.id, request.credential)

    # Verifica fila
    queue_item = get_existing_queue_item(db, db_user.id)
    if queue_item:
        if queue_item.status == QueueStatus.BEING_SERVED:
            raise AppException("queue.user_already_active")
        elif queue_item.status in [QueueStatus.WAITING, QueueStatus.CALLED_PENDING]:
            raise AppException("queue.user_already_registered")
        else:
            # Opcional: outros status (DONE, CANCELLED, SKIPPED) podem permitir nova fila
            pass

    # Cria ‘item’ de fila se não existir
    queue_item = enqueue_user(db, db_user, operator_id, request.attendance_type)

    audit_queue_action(
        db,
        action=AuditAction.QUEUE_CREATED,
        item=queue_item,
        operator_id=operator_id,
        details={
            "attendance_type": request.attendance_type,
            "priority_score": queue_item.priority_score,
        },
    )

    db.commit()
    return db_user, db_cred, queue_item


def _create_or_get_credential(
        db: Session, user_id: int, credential_model
) -> type[UserCredential] | UserCredential:
    """
    Gerencia as credenciais do utilizador. Aplica Hash HMAC no ‘ID’ do sensor.
    """
    # 1. Gerar o hash seguro do ID vindo do sensor/middleware
    hashed_identifier = hash_identifier(
        credential_model.identifier
    )  # Supondo que o modelo tenha um campo biometric_hash

    # 2. Verifica se este utilizador já tem esta digital cadastrada
    existing_user_cred = (
        db.query(UserCredential)
        .filter(
            UserCredential.user_id == user_id, UserCredential.identifier == hashed_identifier
        )
        .first()
    )
    if existing_user_cred:
        return existing_user_cred

    # 3. Segurança Global: Verifica se esta digital pertence a outra pessoa
    existing_global = (
        db.query(UserCredential).filter(UserCredential.identifier == hashed_identifier).first()
    )
    if existing_global:
        raise AppException("credential.already_registered")

    # 4. Cria credencial (‘hardware’ por padrão neste fluxo)
    credential = UserCredential(
        user_id=user_id,
        cred_type="zkteco",  # Define que veio do hardware
        identifier=hashed_identifier,
    )
    db.add(credential)
    db.flush()

    return credential
