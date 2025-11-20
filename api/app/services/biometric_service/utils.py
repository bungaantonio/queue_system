import hmac
import hashlib
import uuid
from datetime import datetime, timedelta, timezone

from app.core.config import settings


# --- Biometric hash ---
def make_biometric_hash(biometric_id: str) -> str:
    secret_value = settings.SERVER_SECRET.get_secret_value()
    return hmac.new(
        secret_value.encode(), biometric_id.encode(), hashlib.sha256
    ).hexdigest()


def verify_biometric_hash(presented_hash: str, stored_hash: str) -> bool:
    return hmac.compare_digest(presented_hash, stored_hash)


# --- Call token ---
def generate_call_token(expiration_minutes: int = settings.TOKEN_EXPIRATION_MINUTES):
    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiration_minutes)
    return token, expires_at


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
