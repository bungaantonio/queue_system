from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.helpers.audit_helpers import get_biometric_for_finished
from app.models.queue_item import QueueItem
from app.crud import queue_crud, user_crud, biometric_crud
from app.schemas.queue_schema import (
    QueueListResponse,
    QueueCreateResponse,
    QueueDetailResponse,
    RegisterRequest,
)
from app.services.audit_service import AuditService
from app.exceptions.exceptions import QueueException
from app.helpers.queue_helpers import build_models as _build_models, format_queue_item
from app.helpers import biometric_helpers


# ------------------ REGISTER USER ------------------
def register_user(db: Session, request: RegisterRequest) -> QueueCreateResponse:
    user_model, biometric_model = _build_models(request)

    # cria usuário
    db_user = user_crud.create_user(db, user_model)

    # cria biometria (somente com biometric_id e finger_index)
    db_bio = biometric_crud.create_biometric(
        db,
        user_id=db_user.id,
        biometric_id=biometric_model.biometric_id,
        finger_index=biometric_model.finger_index,
    )

    # adiciona na fila
    queue_item = queue_crud.get_queue_item(db, db_user.id)

    return QueueCreateResponse(
        status="success",
        message="Usuário registrado e adicionado à fila",
        user=db_user,
        biometric=db_bio,
        queue=QueueDetailResponse.from_orm(queue_item),
    )


# ------------------ MANUAL INSERT ------------------
def manual_insert(db: Session, user_id: int) -> QueueCreateResponse:
    db_user = user_crud.get_user(db, user_id)
    if not db_user:
        raise QueueException("queue_user_not_found")

    queue_item = queue_crud.get_queue_item(db, db_user.id)

    return QueueCreateResponse(
        status="success",
        message="User added to the queue (admin)",
        user=db_user,
        biometric=None,
        queue=QueueDetailResponse.from_orm(queue_item),
    )


# ------------------- HANDLE BIOMETRIC SCAN ------------------
def handle_biometric_scan(db: Session, biometric_id: str) -> QueueItem:
    user_id = biometric_helpers.identify_user(db, biometric_id)
    queue_item = queue_crud.get_active_queue_item_by_user(db, user_id)

    if queue_item:
        # Se estava aguardando verificação, atualiza para 'being_served'
        if queue_item.status == "called_pending_verification":
            queue_item.status = "being_served"
            queue_item.timestamp = datetime.now(timezone.utc)
            db.commit()
            db.refresh(queue_item)
        return queue_item

    return queue_crud.insert_user_at_end(db, user_id)


# ------------------ LIST QUEUE ------------------
def list_waiting_queue(db: Session) -> list[QueueListResponse]:
    queue_items = queue_crud.get_waiting_and_called(db)
    return [format_queue_item(item) for item in queue_items]


# ------------------ CALL NEXT ------------------
def call_next(db: Session) -> QueueItem:
    if queue_crud.has_active_service(db):
        raise QueueException("queue_blocked_pending_verification")

    next_item = queue_crud.get_next_waiting_item(db)
    if not next_item:
        raise QueueException("queue_empty")

    updated_item = queue_crud.mark_as_called(db, next_item)

    AuditService.log_action(
        db,
        action="QUEUE_CALLED",
        user_id=updated_item.user_id,
        queue_item_id=updated_item.id,
        details=f"Usuário {updated_item.user_id} chamado para atendimento",
    )

    return updated_item


# ------------------ FINISH CURRENT ------------------
def finish_current(db: Session) -> QueueItem:
    current = queue_crud.get_current_being_served(db)
    if not current:
        raise QueueException("queue_no_active_service")

    done_item = queue_crud.mark_as_done(db, current)

    biometric_id = get_biometric_for_finished(db, done_item.id)

    AuditService.log_action(
        db,
        action="QUEUE_FINISHED",
        user_id=done_item.user_id,
        queue_item_id=done_item.id,
        biometric_id=biometric_id,
        details=f"Usuário {done_item.user_id} finalizou atendimento",
    )

    return done_item


# ------------------ SKIP CURRENT ------------------
def skip_current(db: Session) -> QueueItem:
    current = queue_crud.get_called_pending(db)
    if not current:
        raise QueueException("queue_no_called_user")

    if current.attempted_verification:
        raise QueueException("queue_user_attempted_verification")

    new_item = queue_crud.reinsert_user_at_end(db, current.user_id)
    queue_crud.mark_as_skipped(db, current)

    return new_item


# ------------------ MARK ATTEMPTED VERIFICATION ------------------
def mark_attempted_verification(db: Session, user_id: int) -> None:
    queue_item = queue_crud.get_called_pending_by_user(db, user_id)
    if queue_item:
        queue_item.attempted_verification = True
        db.commit()


# ------------------ PROMOTE TO BEING SERVED ------------------
def promote_to_being_served(db: Session, user_id: int) -> QueueItem:
    queue_item = queue_crud.get_called_pending_by_user(db, user_id)
    if not queue_item:
        raise QueueException("queue_no_called_user")

    queue_item.status = "being_served"
    queue_item.timestamp = datetime.now(timezone.utc)
    db.commit()
    db.refresh(queue_item)
    return queue_item
