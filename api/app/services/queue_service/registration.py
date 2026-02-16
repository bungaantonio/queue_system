# app/services/queue_service/registration.py
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.crud.user.create import create_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item

from app.models.enums import AuditAction, QueueStatus
from app.models.user import User
from app.models.user_credential import UserCredential

from app.helpers.audit_helpers import audit_queue_action, build_audit_details



def create_user_with_credential_and_queue(db, request, operator_id):
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
        details=build_audit_details(
            action=AuditAction.QUEUE_CREATED,
            msg="Usuário registado e adicionado na fila",
            extra={
                "attendance_type": request.attendance_type,
                "priority_score": queue_item.priority_score,
            },
        ),
    )

    db.commit()
    return db_user, db_cred, queue_item


def _create_or_get_credential(
        db: Session, user_id: int, credential_model
) -> type[UserCredential] | UserCredential:
    """
    Gerencia as credenciais do utilizador. Aplica Hash HMAC no ‘ID’ do sensor.
    """
    # 1. Valor bruto vindo do sensor/middleware
    raw_identifier = credential_model.identifier

    # 2. Segurança Global: Verifica se esta digital pertence a outra pessoa
    existing_global = (
        db.query(UserCredential).filter(UserCredential.identifier == raw_identifier).first()
    )
    if existing_global:
        raise AppException("credential.already_registered")

    # 3. Cria credencial (‘hardware’ por padrão neste fluxo)
    credential = UserCredential(
        user_id=user_id,
        cred_type="zkteco",  # Define que veio do hardware
        identifier=raw_identifier,
    )
    db.add(credential)
    db.flush()

    return credential
