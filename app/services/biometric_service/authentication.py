from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.crud.biometric import (
    mark_as_being_served,
    mark_biometric_attempt,
    mark_biometric_verified,
)
from app.helpers.logger import get_logger
from app.models.enums import QueueStatus
from app.models.queue_item import QueueItem

from app.services.biometric_service import utils

logger = get_logger(__name__)


class BiometricAuthService:

    @staticmethod
    def authenticate_user(
        db: Session,
        user_id: int,
        presented_biometric_hash: str,
        presented_call_token: str,
        operator_id: int | None = None,
    ) -> QueueItem:
        """
        Autentica usuário chamado com biometria + call_token.
        Versão debug: imprime todos os itens do usuário.
        """

        # Listar todos os itens do usuário para debug
        all_items = db.query(QueueItem).filter(QueueItem.user_id == user_id).all()
        logger.debug(
            "Itens do usuário recuperados para autenticação",
            extra={
                "extra_data": {
                    "user_id": user_id,
                    "total_items": len(all_items),
                    "items": [
                        {
                            "id": i.id,
                            "status": (
                                i.status.value
                                if hasattr(i.status, "value")
                                else str(i.status)
                            ),
                            "has_biometric_hash": bool(i.biometric_hash),
                            "has_call_token": bool(i.call_token),
                        }
                        for i in all_items
                    ],
                }
            },
        )
        # Recupera o item chamado (status CALLED_PENDING)
        item = (
            db.query(QueueItem)
            .filter(
                QueueItem.user_id == user_id,
                QueueItem.status == QueueStatus.CALLED_PENDING,
            )
            .first()
        )

        if not item:
            logger.warning(
                "Usuário não possui item chamado pendente",
                extra={
                    "extra_data": {
                        "user_id": user_id,
                        "expected_status": QueueStatus.CALLED_PENDING.value,
                    }
                },
            )
            raise QueueException("user_not_called_or_not_pending")

        # Valida call_token
        if not utils.validate_call_token(
            presented_call_token, item.call_token, item.call_token_expires_at
        ):
            logger.warning(
                "Token de chamada inválido ou expirado",
                extra={
                    "extra_data": {
                        "user_id": user_id,
                        "expected_token": item.call_token,
                        "presented_token": presented_call_token,
                    }
                },
            )
            raise QueueException("invalid_or_expired_call_token")

        # Valida biometria
        if not utils.verify_biometric_hash(
            presented_biometric_hash, item.biometric_hash
        ):
            mark_biometric_attempt(db, item, operator_id)
            logger.error(
                "Falha de autenticação biométrica",
                extra={
                    "extra_data": {
                        "user_id": user_id,
                        "item_id": item.id,
                        "operator_id": operator_id,
                    }
                },
            )
            raise QueueException("biometric_mismatch")

        # Sucesso: marca verificado e em atendimento
        mark_biometric_verified(db, item, operator_id)
        mark_as_being_served(db, item, operator_id)
        logger.info(
            "Usuário autenticado com sucesso",
            extra={
                "extra_data": {
                    "user_id": user_id,
                    "item_id": item.id,
                    "operator_id": operator_id,
                    "status": QueueStatus.BEING_SERVED.value,
                }
            },
        )

        return item
