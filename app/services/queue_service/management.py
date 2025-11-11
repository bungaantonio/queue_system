from typing import Optional
from sqlalchemy.orm import Session

from app.exceptions.exceptions import QueueException
from app.helpers.audit_helpers import get_biometric_for_finished

from app.helpers.logger import get_logger
from app.schemas.queue_schema.response import (
    QueueConsult,
    QueueDetailItem,
    QueueCalledItem,
)

from app.crud import (
    get_user,
    get_next_waiting_item,
    get_active_service_item,
    mark_as_called,
    mark_as_skipped,
    mark_as_done,
    mark_as_cancelled,
    mark_attempted_verification,
    has_active_service,
    get_pending_verification_item,
    get_called_pending_by_user,
    get_existing_queue_item,
    requeue_user,
)

logger = get_logger(__name__)


def call_next_user(db: Session, operator_id: Optional[int] = None) -> QueueCalledItem:
    """Chama o próximo usuário da fila, considerando prioridade."""
    if has_active_service(db):
        logger.warning(
            "Tentativa de chamar próximo usuário bloqueada por serviço ativo"
        )
        raise QueueException("blocked_pending_verification")

    next_item = get_next_waiting_item(db)
    if not next_item:
        logger.info("Fila vazia ao tentar chamar próximo usuário")
        raise QueueException("empty")

    updated_item = mark_as_called(db, next_item, operator_id=operator_id)
    db.flush()

    logger.info(
        f"Usuário chamado: {updated_item.id}",
        extra={"extra_data": {"operator_id": operator_id, "user_id": updated_item.id}},
    )
    return QueueCalledItem.from_orm_item(updated_item)


def complete_active_user_service(db: Session) -> QueueDetailItem:
    """Conclui o atendimento do usuário ativo."""
    current_item = get_active_service_item(db)
    if not current_item:
        logger.warning("Tentativa de concluir serviço sem usuário ativo")
        raise QueueException("no_active_service")

    done_item = mark_as_done(db, current_item)
    _ = get_biometric_for_finished(db, done_item.id)

    logger.info(
        f"Atendimento concluído: {done_item.id}",
        extra={"extra_data": {"user_id": done_item.id}},
    )
    return QueueDetailItem.from_orm_item(done_item)


def skip_called_user(db: Session) -> QueueDetailItem:
    """
    Pula o usuário chamado (pendente de verificação), movendo-o algumas posições abaixo.
    A lógica de reposicionamento está em `update.mark_as_skipped`.
    """
    current_item = get_pending_verification_item(db)
    if not current_item:
        logger.warning("Tentativa de pular usuário sem usuário chamado")
        raise QueueException("no_called_user")

    if current_item.attempted_verification:
        logger.warning(f"Usuário já tentou verificação: {current_item.id}")
        raise QueueException("user_attempted_verification")

    updated_item = mark_as_skipped(db, current_item)

    logger.info(
        f"Usuário pulado: {updated_item.id}",
        extra={"extra_data": {"user_id": updated_item.id}},
    )
    return QueueDetailItem.from_orm_item(updated_item)


def mark_user_verification_attempted(db: Session, user_id: int) -> None:
    """Marca que o usuário tentou verificação biométrica."""
    queue_item = get_called_pending_by_user(db, user_id)
    if queue_item:
        verificated = mark_attempted_verification(db, queue_item)
        logger.info(
            f"Usuário tentou verificação biométrica: {user_id}",
            extra={"extra_data": {"user_id": user_id}},
        )
    # Criar um scheme para verificação


def cancel_active_user(db: Session, user_id: int) -> QueueDetailItem:
    """Cancela o atendimento do usuário ativo."""
    queue_item = get_existing_queue_item(db, user_id)
    if not queue_item:
        logger.warning(f"Tentativa de cancelar usuário inexistente: {user_id}")
        raise QueueException("no_active_user")

    cancelled_item = mark_as_cancelled(db, queue_item)

    logger.info(
        f"Atendimento cancelado: {user_id}", extra={"extra_data": {"user_id": user_id}}
    )
    return QueueDetailItem.from_orm_item(cancelled_item)


def requeue_user_service(db, request):
    """
    Reagenda o atendimento de um usuário, reinserindo-o na fila com base
    nas políticas de prioridade e SLA.
    """
    user = get_user(db, request.user_id)
    if not user:
        logger.warning(
            f"Tentativa de reagendar usuário não encontrado: {request.user_id}"
        )
        raise QueueException("user_not_found")

    queue_item = requeue_user(
        db,
        user=user,
        operator_id=request.operator_id,
        attendance_type=request.attendance_type,
    )

    logger.info(
        "Usuário re-agendado na fila: {request.user_id}",
        extra={
            "extra_data": {
                "user_id": request.user_id,
                "operator_id": request.operator_id,
            }
        },
    )
    return QueueConsult.from_queue_item(queue_item)
