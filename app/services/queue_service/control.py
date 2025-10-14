from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.crud import queue_crud
from app.exceptions.exceptions import QueueException
from app.helpers.audit_helpers import get_biometric_for_finished
from app.helpers.queue_helpers import map_to_queue_detail
from app.schemas.queue_schema import QueueDetailResponse
from app.services.audit_service import AuditService


def call_next_user(db: Session) -> QueueDetailResponse:
    """Chama o próximo usuário da fila."""
    if queue_crud.has_active_service(db):
        raise QueueException("blocked_pending_verification")

    next_item = queue_crud.get_next_waiting_item(db)
    if not next_item:
        raise QueueException("empty")

    updated_item = queue_crud.mark_as_called(db, next_item)

    AuditService.log_action(
        db,
        action="QUEUE_CALLED",
        user_id=updated_item.user_id,
        queue_item_id=updated_item.id,
        details=f"Usuário {updated_item.user_id} chamado para atendimento",
    )

    return map_to_queue_detail(updated_item)


def complete_active_user_service(db: Session) -> QueueDetailResponse:
    """Conclui o atendimento do usuário ativo."""
    current_item = queue_crud.get_active_item(db)
    if not current_item:
        raise QueueException("no_active_service")

    done_item = queue_crud.mark_as_done(db, current_item)
    biometric_id = get_biometric_for_finished(db, done_item.id)

    AuditService.log_action(
        db,
        action="QUEUE_FINISHED",
        user_id=done_item.user_id,
        queue_item_id=done_item.id,
        biometric_id=biometric_id,
        details=f"Usuário {done_item.user_id} finalizou atendimento",
    )

    return map_to_queue_detail(done_item)


def skip_called_user(db: Session) -> QueueDetailResponse:
    """Pula o usuário chamado (pendente de verificação)."""
    current_item = queue_crud.get_pending_verification_item(db)
    if not current_item:
        raise QueueException("no_called_user")

    if current_item.attempted_verification:
        raise QueueException("user_attempted_verification")

    new_item = queue_crud.reinsert_user_at_end(db, current_item.user_id)
    queue_crud.mark_as_skipped(db, current_item)

    return map_to_queue_detail(new_item)


def start_service_for_called_user(db: Session, user_id: int) -> QueueDetailResponse:
    """Promove usuário chamado para atendimento ativo."""
    queue_item = queue_crud.get_called_pending_by_user(db, user_id)
    if not queue_item:
        raise QueueException("no_called_user")

    queue_item.status = "being_served"
    queue_item.timestamp = datetime.now(timezone.utc)
    db.commit()
    db.refresh(queue_item)
    return map_to_queue_detail(queue_item)


def mark_user_verification_attempted(db: Session, user_id: int) -> None:
    """Marca que o usuário tentou verificação biométrica."""
    queue_item = queue_crud.get_called_pending_by_user(db, user_id)
    if queue_item:
        queue_item.attempted_verification = True
        db.commit()
