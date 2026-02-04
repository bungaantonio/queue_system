# app/routers/queue_router/queue_api.py
from typing import List, Optional
from app.core.security import get_operator_id
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.crud.user.create import create_user
from app.db.database import get_db
from app.exceptions.exceptions import BiometricException, QueueException
from app.helpers.queue_broadcast import broadcast_state_sync
from app.schemas.queue_schema.response import (
    QueueCalledItem,
    QueueConsult,
    QueueDetailItem,
    QueueListItem,
)
from app.schemas.queue_schema.request import QueueRegister, QueueCancel, QueueRequeue
from app.services.queue_service import consult, management

from app.services.queue_service.registration import (
    create_user_with_biometric_and_queue,
)

router = APIRouter()


@router.post("/register", response_model=QueueConsult)
def register_user(
    request: QueueRegister,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    # Transação atômica
    with db.begin():
        db_user, db_bio, queue_item = create_user_with_biometric_and_queue(
            db,
            request,
            operator_id=request.operator_id,
        )
        user_queue_status = QueueConsult.from_queue_item(queue_item)

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return user_queue_status


@router.get(
    "/waiting-and-called", response_model=dict
)  # Mude para dict ou um Schema de Estado
def list_queue(db: Session = Depends(get_db)):
    """
    Retorna o estado COMPLETO da fila para carga inicial do React.
    """
    from app.helpers.queue_broadcast import build_queue_state

    return build_queue_state(db)


@router.post("/call-next", response_model=QueueCalledItem)
def call_next(
    db: Session = Depends(get_db),
    operator_id: Optional[int] = None,
    background_tasks: BackgroundTasks = None,
):
    """
    Chama o próximo usuário da fila.

    Retorna call_token e biometric_hash apenas neste endpoint
    para clientes confiáveis/testes internos.
    """
    with db.begin():
        next_user_item = management.call_next_user(db, operator_id=operator_id)
        if not next_user_item:
            raise QueueException("no_waiting_user")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return next_user_item


## -- Endpoint interno para clientes confiáveis --
@router.get("/next-called-for-client", response_model=QueueCalledItem)
def next_called_for_client(db: Session = Depends(get_db), operator_id: int = None):
    """Retorna próximo usuário chamado com tokens, apenas para clientes confiáveis."""
    return consult.get_next_called_with_tokens(db, operator_id)


## -- Fim do endpoint interno --


@router.get("/current", response_model=QueueDetailItem)
def get_current_user(db: Session = Depends(get_db)):
    """
    Retorna o usuário atualmente em atendimento (status = BEING_SERVED).
    Lança exceção se não houver ninguém em atendimento.
    """
    return consult.get_active_user(db)


@router.post("/finish", response_model=QueueDetailItem)
def finish_current_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Finaliza o atendimento ativo (BEING_SERVED → DONE).
    Libera a fila para que o próximo possa ser chamado.
    """
    with db.begin():
        finished_item = management.complete_active_user_service(db)
        if not finished_item:
            raise QueueException("no_active_service")

    # Atualiza estado da fila para todos os clientes conectados
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return finished_item


@router.post("/cancel", response_model=QueueDetailItem)
def cancel_active_user(
    request: QueueCancel,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Cancela o atendimento do usuário ativo (status → CANCELLED).

    Pode ser usado quando o atendimento precisa ser encerrado sem conclusão,
    liberando a fila para o próximo chamado.
    """
    with db.begin():
        cancelled_item = management.cancel_active_user(db, request.item_id)
        if not cancelled_item:
            raise QueueException("no_active_user")

        # Atualiza estado global da fila para dashboards e painéis
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return cancelled_item


@router.post("/requeue", response_model=QueueConsult)
def requeue_user_endpoint(
    request: QueueRequeue,
    db: Session = Depends(get_db),
    operator_id: int = Depends(get_operator_id),
    background_tasks: BackgroundTasks = None,
):
    """
    Reagenda o atendimento de um usuário (novo item WAITING).
    Pode ser usado após cancelamento, ausência ou erro operacional.
    """

    result = management.requeue_user_service(db, request, operator_id=operator_id)
    if not result:
        raise QueueException("requeue_failed")

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result


@router.post("/skip", response_model=QueueDetailItem)
def skip_current_called_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Pula o usuário atualmente chamado (CALLED_PENDING), movendo-o algumas posições abaixo
    na fila, mantendo-o como WAITING.

    """
    with db.begin():
        updated_item = management.skip_called_user(db)
        if not updated_item:
            raise QueueException("no_called_user")

    # Atualiza estado global da fila para dashboards/painéis
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return updated_item
