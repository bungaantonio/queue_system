import uuid
from datetime import datetime, timedelta, timezone

TOKEN_EXPIRATION_MINUTES = 2


class CallTokenService:

    @staticmethod
    def generate():
        token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=TOKEN_EXPIRATION_MINUTES
        )
        return token, expires_at

    @staticmethod
    def is_valid(token, stored_token, expires_at):
        now = datetime.now(timezone.utc)
        return token == stored_token and expires_at and expires_at > now
