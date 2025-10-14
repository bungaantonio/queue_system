from datetime import datetime, timezone
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.helpers.audit_helpers import get_biometric_for_finished
from app.helpers.queue_helpers import map_to_queue_detail, map_to_queue_list
from app.models.queue_item import QueueItem
from app.crud import queue_crud, user_crud, biometric_crud
from app.schemas.queue_schema import (
    QueueConsultResponse,
    QueueDetailResponse,
    RegisterRequest,
)
from app.services.audit_service import AuditService
from app.exceptions.exceptions import QueueException
from app.helpers import biometric_helpers


# ------------------ REGISTER USER ------------------
def register_user(
    db: Session, request: RegisterRequest
) -> Tuple[object, object, QueueItem]:
    """
    Cria usuário, biometria e adiciona na fila.
    Retorna (db_user, db_bio, queue_item) — ENTIDADES ORM/DB, sem DTO.
    """
    user_model, biometric_model = request.user, request.biometric

    db_user = user_crud.create_user(db, user_model)

    db_bio = biometric_crud.create_biometric(
        db,
        user_id=db_user.id,
        biometric_id=biometric_model.biometric_id,
        finger_index=biometric_model.finger_index,
    )

    queue_item = queue_crud.get_queue_item(db, db_user.id)

    return db_user, db_bio, queue_item


# ------------------- HANDLE BIOMETRIC SCAN ------------------
def handle_biometric_scan(db: Session, biometric_id: str) -> dict | None:
    """
    Identifica usuário pela biometria, atualiza status se necessário e
    retorna dict seguro pronto para frontend.
    """
    user_id = biometric_helpers.identify_user(db, biometric_id)
    queue_item = queue_crud.get_active_queue_item_by_user(db, user_id)

    if queue_item and queue_item.status == "called_pending_verification":
        queue_item.status = "being_served"
        queue_item.timestamp = datetime.now(timezone.utc)
        db.commit()
        db.refresh(queue_item)

    # Se ainda não existe, insere no fim da fila
    if not queue_item:
        queue_item = queue_crud.insert_user_at_end(db, user_id)

    # Retorna dict mapeado, pronto para frontend
    return map_to_queue_detail(queue_item)


# ------------------ LIST QUEUE ------------------
def list_waiting_queue(db: Session) -> list[dict]:
    """
    Retorna todos os itens 'waiting' ou 'called_pending_verification',
    já mapeados para o formato frontend (resumido).
    """
    queue_orm = queue_crud.get_waiting_and_called(db)
    return [map_to_queue_list(item) for item in queue_orm if item]


# ------------------ GET CURRENT USER BEING SERVED ------------------
def get_current(db: Session) -> dict | None:
    current = queue_crud.get_current_being_served(db)
    return map_to_queue_detail(current) if current else None


# ------------------ CALL NEXT ------------------
def call_next(db: Session) -> QueueDetailResponse:
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

    return map_to_queue_detail(updated_item)


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

    return map_to_queue_detail(done_item)


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


# ------------------ GET CALLED USER (pending verification) ------------------
def get_called(db: Session) -> dict | None:
    called = queue_crud.get_called_pending(db)
    return map_to_queue_detail(called) if called else None


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


def consult_user_in_queue_by_document_or_phone(
    db: Session, id_number: str = None, phone: str = None
) -> QueueConsultResponse:
    if id_number:
        user = user_crud.get_user_by_id_number(db, id_number)
    elif phone:
        user = user_crud.get_user_by_phone(db, phone)
    else:
        raise QueueException("Informe o número de bilhete ou telefone")

    if not user:
        raise QueueException("Usuário não encontrado")

    queue_status = queue_crud.get_active_queue_item_by_user(db, user.id)
    if not queue_status:
        return QueueConsultResponse(in_queue=False, message="Usuário não está na fila")

    return QueueConsultResponse(
        in_queue=True,
        position=queue_status.position,
        status=queue_status.status,
        message="Usuário está na fila",
    )
