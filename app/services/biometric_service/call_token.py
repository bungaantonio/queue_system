import uuid
from datetime import datetime, timedelta, timezone
from app.core.config import settings
from app.helpers.logger import get_logger

logger = get_logger(__name__)


class CallTokenService:

    @staticmethod
    def generate():
        """
        Gera um novo token de chamada e define seu tempo de expiração.
        """
        token = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(
            minutes=settings.TOKEN_EXPIRATION_MINUTES
        )

        logger.debug(
            "Novo call_token gerado",
            extra={
                "extra_data": {
                    "expires_at": expires_at.isoformat(),
                    "token_preview": f"{token[:8]}...",
                }
            },
        )
        return token, expires_at

    @staticmethod
    def is_valid(token, stored_token, expires_at):
        """
        Valida se o token fornecido corresponde ao armazenado e não expirou.
        """
        now = datetime.now(timezone.utc)
        is_valid = token == stored_token and expires_at and expires_at > now

        logger.debug(
            "Validação de call_token executada",
            extra={
                "extra_data": {
                    "token_match": token == stored_token,
                    "expired": expires_at <= now if expires_at else True,
                    "expires_at": expires_at.isoformat() if expires_at else None,
                    "result": is_valid,
                }
            },
        )

        return is_valid
