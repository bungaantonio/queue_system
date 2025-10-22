from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.queue_service import (
    create_user_with_biometric_and_queue,
    list_waiting_and_called_items,
    call_next_user,
    complete_active_user_service,
    skip_called_user,
    get_user_queue_status,
)
from app.helpers.queue_broadcast import broadcast_state
from app.schemas.queue_schema import QueueConsult, QueueListItem, QueueDetailItem


router = APIRouter()


# ============================================================
# =============== REGISTER / CREATE ===========================
# ============================================================


# ============================================================
# =============== LIST & CONSULT ==============================
# ============================================================


@router.get("/list", response_model=list[QueueListItem])
def list_queue(db: Session = Depends(get_db)):
    """Lista os usuários com status 'waiting' ou 'called_pending_verification'."""
    return list_waiting_and_called_items(db)


@router.get("/consult", response_model=QueueConsult)
def consult_user_in_queue(
    id_number: str = Query(None, description="Número de bilhete"),
    phone: str = Query(None, description="Número de telefone"),
    db: Session = Depends(get_db),
):
    """Consulta se o usuário está na fila e em qual posição."""
    return get_user_queue_status(db, id_number, phone)


# ============================================================
# =============== ACTIVE / CALLED USERS =======================
# ============================================================


@router.get("/current", response_model=QueueDetailItem)
def get_current_user(db: Session = Depends(get_db)):
    """Retorna o usuário atualmente em atendimento."""
    return get_active_queue_item(db)


@router.get("/called", response_model=QueueDetailItem)
def get_called_user(db: Session = Depends(get_db)):
    """Retorna o usuário chamado, pendente de verificação biométrica."""
    return get_pending_verification_item(db)


# ============================================================
# =============== BIOMETRIC SCAN ==============================
# ============================================================




# ============================================================
# =============== QUEUE ACTIONS (NEXT / DONE / SKIP) ==========
# ============================================================


@router.put("/next", response_model=QueueDetailItem)
def call_next(db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    """Chama o próximo usuário da fila."""
    next_item = call_next_user(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailItem(
        message="Próximo usuário chamado. Aguardando confirmação biométrica.",
        queue=QueueDetailItem(**next_item),
    )


@router.put("/done", response_model=QueueDetailItem)
def complete_service(
    db: Session = Depends(get_db), background_tasks: BackgroundTasks = None
):
    """Conclui o atendimento do usuário atualmente em serviço."""
    done_item = complete_active_user_service(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailItem(
        message="Atendimento concluído.",
        queue=QueueDetailItem(**done_item),
    )


@router.put("/skip", response_model=QueueDetailItem)
def skip_user(db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    """Pula o usuário chamado (ausente) e o reinsere no fim da fila."""
    new_item = skip_called_user(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailItem(
        message="Usuário ausente, reinserido no fim da fila.",
        queue=QueueDetailItem(**new_item),
    )
