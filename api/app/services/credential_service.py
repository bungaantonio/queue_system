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
    def authenticate_user(
        db: Session,
        queue_item_id: int,
        presented_credential_hash: str,
        presented_call_token: str,
        operator_id: int,
    ):

        # 1️⃣ Busca item chamado
        item = get_called_pending_by_queue_item_id(db, queue_item_id)
        if not item:
            raise AppException("queue.item_not_called")

        # 2️⃣ Valida token
        if not utils.validate_call_token(
            presented_call_token,
            item.call_token,
            item.call_token_expires_at,
        ):
            raise AppException("queue.invalid_or_expired_call_token")

        # 3️⃣ Verifica se já existe alguém em atendimento
        active = get_active_being_served(db)
        if active:
            raise AppException("queue.already_being_served")

        # 4️⃣ Busca credencial
        hashed_input = utils.compute_server_hash(presented_credential_hash)

        credential = (
            db.query(UserCredential)
            .filter(
                UserCredential.user_id == item.user_id,
                UserCredential.cred_type == "zkteco",
            )
            .first()
        )

        if not credential or not utils.verify_credential_hash(
            hashed_input,
            credential.identifier,
        ):
            mark_credential_attempt(db, item)

            audit_log(
                db=db,
                action=AuditAction.CREDENTIAL_FAILED,
                operator_id=operator_id,
                user_id=item.user_id,
                queue_item_id=item.id,
                credential_id=credential.id if credential else None,
            )

            raise AppException("credential.mismatch")

        # 5️⃣ Sucesso
        mark_credential_verified(db, item)
        set_being_served(db, item)

        audit_log(
            db=db,
            action=AuditAction.CREDENTIAL_VERIFIED,
            operator_id=operator_id,
            user_id=item.user_id,
            queue_item_id=item.id,
            credential_id=credential.id,
        )

        return item
