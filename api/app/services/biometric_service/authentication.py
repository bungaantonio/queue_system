from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.crud.biometric import (
    mark_as_being_served,
    mark_biometric_attempt,
    mark_biometric_verified,
    get_called_pending_by_queue_item_id,
)
from app.models.queue_item import QueueItem

from app.services.biometric_service import utils


class BiometricAuthService:

    @staticmethod
    def authenticate_user(
        db: Session,
        queue_item_id: int,
        presented_biometric_hash: str,
        presented_call_token: str,
        operator_id: int | None = None,
    ) -> QueueItem:
        """
        Autentica usuário chamado com biometria + call_token.
        """

        # 1️⃣ Recupera o item chamado
        item = get_called_pending_by_queue_item_id(db, queue_item_id)
        if not item:
            raise QueueException("queue_item_not_called_or_not_pending")

        # 2️⃣ Valida call_token
        if not utils.validate_call_token(
            presented_call_token, item.call_token, item.call_token_expires_at
        ):
            raise QueueException("invalid_or_expired_call_token")

        # 3️⃣ Valida biometria
        if not utils.verify_biometric_hash(
            presented_biometric_hash, item.biometric_hash
        ):
            mark_biometric_attempt(db, item, operator_id)
            raise QueueException("biometric_mismatch")

        # 4️⃣ Sucesso: marca verificado e em atendimento
        mark_biometric_verified(db, item, operator_id)
        mark_as_being_served(db, item, operator_id)

        return item
