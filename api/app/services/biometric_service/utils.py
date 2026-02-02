# app/services/biometric_service/utils.py
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from app.core.config import settings


def compute_server_hash(raw_id: str) -> str:
    """Transforma o ID do hardware em um hash seguro para o banco."""
    secret = settings.SERVER_SECRET.get_secret_value()
    return hmac.new(secret.encode(), raw_id.encode(), hashlib.sha256).hexdigest()


def secure_compare(presented: str, stored: str) -> bool:
    """Compara dois hashes de forma segura contra timing attacks."""
    if not presented or not stored:
        return False
    return hmac.compare_digest(presented, stored)


def validate_call_token(
    presented_token: str, stored_token: str, expires_at: datetime
) -> bool:
    now = datetime.now(timezone.utc)

    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    return (
        bool(stored_token)
        and presented_token == stored_token
        and expires_at
        and expires_at > now
    )
