import hmac
import hashlib
import uuid
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.helpers.logger import get_logger


logger = get_logger(__name__)


# --- Biometric hash ---
def make_biometric_hash(biometric_id: str) -> str:
    """Gera hash HMAC-SHA256 a partir de um ID biométrico."""
    secret_value = settings.SERVER_SECRET.get_secret_value()
    hashed = hmac.new(
        secret_value.encode(), biometric_id.encode(), hashlib.sha256
    ).hexdigest()

    logger.debug(
        "Biometric hash gerado com sucesso",
        extra={"extra_data": {"biometric_id_len": len(biometric_id)}},
    )

    return hashed


def verify_biometric_hash(presented_hash: str, stored_hash: str) -> bool:
    """Compara hashes biométricos de forma segura."""
    result = hmac.compare_digest(presented_hash, stored_hash)

    logger.debug(
        "Comparação de hash biométrico executada",
        extra={"extra_data": {"match": result}},
    )

    return result


# --- Call token ---
def generate_call_token(expiration_minutes: int = settings.TOKEN_EXPIRATION_MINUTES):
    """Gera um token de chamada temporário."""
    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiration_minutes)

    logger.debug(
        "Call token gerado",
        extra={"extra_data": {"expires_at": expires_at.isoformat()}},
    )

    return token, expires_at


def validate_call_token(
    presented_token: str, stored_token: str, expires_at: datetime
) -> bool:
    """Valida um token de chamada e verifica se está dentro do prazo."""
    now = datetime.now(timezone.utc)

    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    is_valid = (
        bool(stored_token)
        and presented_token == stored_token
        and expires_at
        and expires_at > now
    )

    if not is_valid:
        logger.warning(
            "Falha na validação de call token",
            extra={
                "extra_data": {
                    "has_token": bool(stored_token),
                    "expired": bool(expires_at and expires_at <= now),
                }
            },
        )
    else:
        logger.debug(
            "Call token validado com sucesso",
            extra={"extra_data": {"expires_at": expires_at.isoformat()}},
        )

    return is_valid
