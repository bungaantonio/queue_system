# app/services/credential_service.py

from sqlalchemy.orm import Session
from app.core.exceptions import AppException
from app.helpers.audit_helpers import audit_log
from app.models.enums import AuditAction
from app.models.user_credential import UserCredential
from app.utils import credential_utils as utils

from app.crud.credential_crud import (
    get_called_pending_by_queue_item_id,
    get_active_being_served,
    mark_credential_verified,
    mark_credential_attempt,
    set_being_served,
)


class CredentialAuthService:

    @staticmethod
    def authenticate_user(db: Session, queue_item_id: int, input_credential: str, presented_call_token: str,
                          operator_id: int):
        # 1. Busca o item da fila
        item = get_called_pending_by_queue_item_id(db, queue_item_id)
        if not item:
            raise AppException("queue.item_not_called")

        # 2. Busca a credencial oficial deste usuário no banco
        user_credential = db.query(UserCredential).filter(
            UserCredential.user_id == item.user_id,
            UserCredential.cred_type == "zkteco"
        ).first()

        if not user_credential:
            raise AppException("credential.not_found")

        # 3. Valida call token e expiração
        if not utils.validate_call_token(
            presented_token=presented_call_token,
            stored_token=item.call_token,
            expires_at=item.call_token_expires_at,
        ):
            raise AppException("queue.invalid_call_token")

        # 4. COMPARAÇÃO DE TEXTO SIMPLES
        # Como o Middleware enviou o template do cache dele, as strings devem ser idênticas.
        if input_credential != user_credential.identifier:
            raise AppException("credential.mismatch")

        # 5. Sucesso! Marca como em atendimento
        mark_credential_verified(db, item)
        set_being_served(db, item)
        db.commit()

        return item



def get_active_templates(db: Session):
    credentials = (
        db.query(UserCredential)
        .filter(UserCredential.cred_type == "zkteco")
        .all()
    )

    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "template": c.identifier,  # identifier = template Base64
        }
        for c in credentials
    ]
