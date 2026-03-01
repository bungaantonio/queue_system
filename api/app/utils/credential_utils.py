# app/utils/credential_utils.py
import hmac
import hashlib
import uuid
from datetime import datetime, timedelta, timezone

from app.core.config import settings


def compute_server_hash(raw_id: str) -> str:
    """Transforma o ‘ID’ do ‘hardware’ em um hash seguro para o banco."""
    secret = settings.SERVER_SECRET.get_secret_value()
    return hmac.new(secret.encode(), raw_id.encode(), hashlib.sha256).hexdigest()


def secure_compare(presented: str, stored: str) -> bool:
    """Compara dois hashes de forma segura contra timing attacks."""
    if not presented or not stored:
        return False
    return hmac.compare_digest(presented, stored)


def verify_credential_hash(presented_hash: str, stored_hash: str) -> bool:
    return hmac.compare_digest(presented_hash, stored_hash)


# --- Call token ---
def generate_call_token(expiration_minutes: int = settings.TOKEN_EXPIRATION_MINUTES):
    token = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiration_minutes)
    return token, expires_at


def hash_identifier(raw_id: str) -> str:
    """Gera o hash único para o banco. O que entra é o ID do sensor, o que sai é o Hash."""
    secret = settings.SERVER_SECRET.get_secret_value()
    return hmac.new(secret.encode(), raw_id.encode(), hashlib.sha256).hexdigest()


def validate_call_token(
    presented_token: str, stored_token: str, expires_at: datetime
) -> bool:
    if not presented_token or not stored_token or not expires_at:
        return False

    # Garante que ambos são UTC para a comparação ser justa
    now = datetime.now(timezone.utc)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    return presented_token == stored_token and expires_at > now
