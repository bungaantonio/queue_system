from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.db.database import get_db
from app.helpers.queue_broadcast import broadcast_state_sync, build_queue_state
from app.helpers.response_helpers import success_response, ApiResponse
from app.schemas.queue_schema.response import (
    QueueCalledItem,
    QueueConsult,
    QueueDetailItem,
    QuickEntryResponse,
    QueueStateSchema,
)
from app.schemas.queue_schema.request import (
    QueueRegister,
    QueueCancel,
    QueueRequeue,
    QuickEntryRequest,
)
from app.services.queue_service import consult, management
from app.services.queue_service.registration import (
    create_user_with_credential_and_queue,
)

from app.core.security import (
    get_current_user,
    resolve_operator_with_system_fallback,
    get_operator_id_with_system_fallback,
)

router = APIRouter()


# 🔹 Registrar utilizador na fila
@router.post("/register", response_model=ApiResponse[QueueConsult])
def register_user(
    request: QueueRegister,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),  # exige ‘login’ humano
):
    db_user, db_bio, queue_item = create_user_with_credential_and_queue(
        db,
        request,
        operator_id=current_operator.id,
    )

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueConsult.from_orm_item(queue_item))


@router.post("/quick-entry", response_model=ApiResponse[QuickEntryResponse])
def entry(
    request: QuickEntryRequest,
    db: Session = Depends(get_db),
    operator_id: int = Depends(get_operator_id_with_system_fallback),
    background_tasks: BackgroundTasks = None,
):
    result = consult.quick_entry_user(
        db=db,
        identifier=request.identifier,
        operator_id=operator_id,
        attendance_type=request.attendance_type,
    )

    db.commit()

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QuickEntryResponse.from_orm_item(result))


# 🔹 Listar fila completa (estado para front-end)
@router.get("/waiting-and-called", response_model=ApiResponse[QueueStateSchema])
def list_queue(db: Session = Depends(get_db)):
    state = build_queue_state(db)
    return success_response(state)


# 🔹 Chamar próximo usuário (pode ser SYSTEM)
@router.post("/call-next", response_model=ApiResponse[QueueCalledItem])
def call_next(
    db: Session = Depends(get_db),
    current_operator=Depends(resolve_operator_with_system_fallback),  # humano ou SYSTEM
    background_tasks: BackgroundTasks = None,
):
    next_user_item = management.call_next_user(db, operator_id=current_operator.id)
    if not next_user_item:
        raise AppException("queue.no_waiting_user")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueCalledItem.from_orm_item(next_user_item))


# 🔹 Endpoint interno para clientes confiáveis
@router.get("/next-called-for-client", response_model=ApiResponse[QueueCalledItem])
def next_called_for_client(
    db: Session = Depends(get_db), operator_id: Optional[int] = None
):
    item = consult.get_next_called_with_tokens(db, operator_id)
    return success_response(QueueCalledItem.from_orm_item(item))


# 🔹 Usuário atualmente em atendimento
@router.get("/current", response_model=ApiResponse[QueueDetailItem])
def get_current_served_user(db: Session = Depends(get_db)):
    active_user = consult.get_served_user(db)
    return success_response(active_user)


# 🔹 Finalizar atendimento (exige humano)
@router.post("/finish", response_model=ApiResponse[QueueDetailItem])
def finish_current_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),
):

    finished_item = management.complete_active_user_service(
        db, operator_id=current_operator.id
    )
    if not finished_item:
        raise AppException("queue.no_active_service")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueDetailItem.from_orm_item(finished_item))


# 🔹 Cancelar atendimento (exige humano)
@router.post("/cancel", response_model=ApiResponse[QueueDetailItem])
def cancel_active_user(
    request: QueueCancel,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),
):
    cancelled_item = management.cancel_active_user(
        db, request.item_id, operator_id=current_operator.id
    )
    if not cancelled_item:
        raise AppException("queue.no_active_service")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueDetailItem.from_orm_item(cancelled_item))


# 🔹 Requeue utilizador (pode ser SYSTEM)
@router.post("/requeue", response_model=ApiResponse[QueueConsult])
def requeue_user_endpoint(
    request: QueueRequeue,
    db: Session = Depends(get_db),
    current_operator=Depends(resolve_operator_with_system_fallback),  # humano ou SYSTEM
    background_tasks: BackgroundTasks = None,
):
    result = management.requeue_user_service(
        db, request, operator_id=current_operator.id
    )
    if not result:
        raise AppException("queue.no_active_service")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueConsult.from_orm_item(result))


# 🔹 Pular usuário chamado (pode ser SYSTEM)
@router.post("/skip", response_model=ApiResponse[QueueDetailItem])
def skip_current_called_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(resolve_operator_with_system_fallback),  # humano ou SYSTEM
):
    updated_item = management.skip_called_user(
        db, current_operator_id=current_operator.id
    )
    if not updated_item:
        raise AppException("queue.no_active_service")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueDetailItem.from_orm_item(updated_item))
