# app/services/biometric_service/authentication.py
# app/services/biometric_service/authentication.py
from sqlalchemy.orm import Session
from app.models.queue_item import QueueItem
from app.models.user_credential import UserCredential
from app.exceptions.exceptions import QueueException
from app.services.biometric_service import utils
from app.crud.biometric import (
    mark_biometric_verified,
    mark_as_being_served,
    mark_biometric_attempt,
)


class BiometricAuthService:
    @staticmethod
    def authenticate_user(
        db: Session,
        queue_item_id: int,
        presented_biometric_hash: str,  # Hash enviado pelo C# ou WebAuthn
        presented_call_token: str,
        operator_id: int,
    ) -> QueueItem:

        # 1. Busca o item da fila
        from app.crud.biometric import get_called_pending_by_queue_item_id

        item = get_called_pending_by_queue_item_id(db, queue_item_id)
        if not item:
            raise QueueException("queue_item_not_called_or_not_pending")

        # 2. Valida Token
        if not utils.validate_call_token(
            presented_call_token, item.call_token, item.call_token_expires_at
        ):
            raise QueueException("invalid_or_expired_call_token")

        # 3. Lógica Híbrida de Identificação
        # O Middleware C# envia o ID puro. Nós calculamos o hash para comparar com o banco.
        hashed_input = utils.compute_server_hash(presented_biometric_hash)

        # Busca a credencial 'zkteco' do usuário dono do ticket
        credential = (
            db.query(UserCredential)
            .filter(
                UserCredential.user_id == item.user_id,
                UserCredential.cred_type == "zkteco",
            )
            .first()
        )

        if not credential or not utils.verify_biometric_hash(
            hashed_input, credential.identifier
        ):
            mark_biometric_attempt(db, item, operator_id)
            db.commit()
            raise QueueException("biometric_mismatch")

        # 4. Sucesso
        mark_biometric_verified(db, item, operator_id)
        mark_as_being_served(db, item, operator_id)

        return item
