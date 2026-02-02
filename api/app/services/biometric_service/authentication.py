# app/services/biometric_service/authentication.py
from sqlalchemy.orm import Session
from app.models.queue_item import QueueItem
from app.crud.biometric.read import get_called_pending_by_queue_item_id
from app.crud.biometric.update import (
    mark_as_being_served,
    mark_biometric_attempt,
    mark_biometric_verified,
)
from app.exceptions.exceptions import QueueException
from app.schemas.biometric_schema.request import BiometricAuthRequest
from app.services.auth_provider import AuthenticationProvider
from app.services.biometric_service.utils import validate_call_token


def authenticate_user(db: Session, request: BiometricAuthRequest) -> QueueItem:
    # 1. Busca o item chamado
    item = get_called_pending_by_queue_item_id(db, request.queue_item_id)
    if not item:
        raise QueueException("queue_item_not_called_or_not_pending")

    # 2. Valida Call Token (Sessão)
    if not validate_call_token(
        request.call_token, item.call_token, item.call_token_expires_at
    ):
        raise QueueException("invalid_or_expired_call_token")

    # 3. Validação Híbrida (A "Mágica")
    # Se o request tem hash, assume zkteco. Se tem webauthn_data, assume webauthn.
    auth_type = "zkteco" if request.biometric_hash else "webauthn"
    auth_data = request.biometric_hash or request.webauthn_data

    is_valid = AuthenticationProvider.verify(db, item.user_id, auth_type, auth_data)

    if not is_valid:
        mark_biometric_attempt(db, item, request.operator_id)
        db.commit()
        raise QueueException("biometric_mismatch")

    # 4. Sucesso
    mark_biometric_verified(db, item, request.operator_id)
    mark_as_being_served(db, item, request.operator_id)
    return item
