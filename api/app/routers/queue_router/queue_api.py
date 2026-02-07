from typing import Optional
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.exceptions.exceptions import QueueException
from app.helpers.queue_broadcast import broadcast_state_sync
from app.schemas.queue_schema.response import (
    QueueCalledItem,
    QueueConsult,
    QueueDetailItem,
    QuickEntryResponse,
)
from app.schemas.queue_schema.request import (
    QueueRegister,
    QueueCancel,
    QueueRequeue,
    QuickEntryRequest,
)
from app.services.queue_service import consult, management
from app.services.queue_service.registration import create_user_with_biometric_and_queue

from app.core.security import get_current_user, resolve_operator_with_system_fallback

router = APIRouter()


# 🔹 Registrar usuário na fila
@router.post("/register", response_model=QueueConsult)
def register_user(
    request: QueueRegister,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),  # exige login humano
):
    db_user, db_bio, queue_item = create_user_with_biometric_and_queue(
        db,
        request,
        operator_id=current_operator.id,
    )
    user_queue_status = QueueConsult.from_queue_item(queue_item)

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return user_queue_status


@router.post("/quick-entry", response_model=QuickEntryResponse)
def entry(
    request: QuickEntryRequest,
    db: Session = Depends(get_db),
    current_operator: int = Depends(resolve_operator_with_system_fallback),
    background_tasks: BackgroundTasks = None,
):
    """
    Entrada rápida na fila.

    - Se feita por operador logado → usa ID do operador
    - Se feita pelo usuário final → usa operador padrão do sistema
    """

    result = consult.quick_entry(
        db, request, request.biometric_hash, operator_id=current_operator.id
    )

    db.commit()

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result


# 🔹 Listar fila completa (estado para front-end)
@router.get("/waiting-and-called", response_model=dict)
def list_queue(db: Session = Depends(get_db)):
    from app.helpers.queue_broadcast import build_queue_state

    return build_queue_state(db)


# 🔹 Chamar próximo usuário (pode ser SYSTEM)
@router.post("/call-next", response_model=QueueCalledItem)
def call_next(
    db: Session = Depends(get_db),
    current_operator=Depends(resolve_operator_with_system_fallback),  # humano ou SYSTEM
    background_tasks: BackgroundTasks = None,
):
    next_user_item = management.call_next_user(db, operator_id=current_operator.id)
    if not next_user_item:
        raise QueueException("no_waiting_user")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return next_user_item


# 🔹 Endpoint interno para clientes confiáveis
@router.get("/next-called-for-client", response_model=QueueCalledItem)
def next_called_for_client(
    db: Session = Depends(get_db), operator_id: Optional[int] = None
):
    return consult.get_next_called_with_tokens(db, operator_id)


# 🔹 Usuário atualmente em atendimento
@router.get("/current", response_model=QueueDetailItem)
def get_current_served_user(db: Session = Depends(get_db)):
    return consult.get_active_user(db)


# 🔹 Finalizar atendimento (exige humano)
@router.post("/finish", response_model=QueueDetailItem)
def finish_current_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),
):
    with db.begin():
        finished_item = management.complete_active_user_service(
            db, operator_id=current_operator.id
        )
        if not finished_item:
            raise QueueException("no_active_service")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return finished_item


# 🔹 Cancelar atendimento (exige humano)
@router.post("/cancel", response_model=QueueDetailItem)
def cancel_active_user(
    request: QueueCancel,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(get_current_user),
):
    with db.begin():
        cancelled_item = management.cancel_active_user(
            db, request.item_id, operator_id=current_operator.id
        )
        if not cancelled_item:
            raise QueueException("no_active_user")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return cancelled_item


# 🔹 Requeue usuário (pode ser SYSTEM)
@router.post("/requeue", response_model=QueueConsult)
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
        raise QueueException("requeue_failed")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result


# 🔹 Pular usuário chamado (pode ser SYSTEM)
@router.post("/skip", response_model=QueueDetailItem)
def skip_current_called_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
    current_operator=Depends(resolve_operator_with_system_fallback),  # humano ou SYSTEM
):
    updated_item = management.skip_called_user(
        db, current_operator_id=current_operator.id
    )
    if not updated_item:
        raise QueueException("no_called_user")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return updated_item
