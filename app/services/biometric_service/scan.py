from typing import Optional
from sqlalchemy.orm import Session

from app.helpers import biometric_helpers
from app.exceptions.exceptions import QueueException
from app.schemas.biometric_schema.response import QuickQueueEntryBiometric
from app.schemas.biometric_schema.request import BiometricScan
from app.crud.user import get_user
from app.crud.queue import enqueue_user, get_existing_queue_item

from app.helpers.logger import get_logger

logger = get_logger(__name__)


def quick_entry(
    db: Session,
    request: BiometricScan,
    biometric_id: str,
    operator_id: Optional[int] = None,
) -> QuickQueueEntryBiometric:
    """
    Entrada rápida na fila via leitura biométrica.
    Identifica o usuário, valida e o adiciona à fila se necessário.
    """
    logger.debug(
        "Iniciando quick_entry", extra={"extra_data": {"operator_id": operator_id}}
    )

    user_id = biometric_helpers.identify_user(db, biometric_id)
    if not user_id:
        logger.warning("Biometria não reconhecida")
        raise QueueException("biometric_not_recognized")

    user = get_user(db, user_id)
    if not user:
        logger.error(
            "Usuário não encontrado", extra={"extra_data": {"user_id": user_id}}
        )
        raise QueueException("user_not_found")

    queue_item = get_existing_queue_item(db, user_id)
    if queue_item:
        logger.info(
            "Usuário já possui item ativo na fila",
            extra={
                "extra_data": {"queue_id": queue_item.id, "status": queue_item.status}
            },
        )
    else:
        queue_item = enqueue_user(
            db,
            user=user,
            operator_id=operator_id,
            attendance_type=request.attendance_type,
        )
        logger.info(
            "Usuário inserido na fila com sucesso",
            extra={
                "extra_data": {
                    "user_id": user_id,
                    "queue_id": queue_item.id,
                    "attendance_type": request.attendance_type,
                }
            },
        )

    return QuickQueueEntryBiometric.from_orm_item(queue_item)
