from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.queue_service import (
    create_user_with_biometric_and_queue,
    process_biometric_scan,
    list_waiting_and_called_items,
    get_active_queue_item,
    get_pending_verification_item,
    call_next_user,
    complete_active_user_service,
    skip_called_user,
    get_user_queue_status,
)
from app.helpers.queue_broadcast import broadcast_state
from app.schemas.queue_schema import (
    QueueListResponse,
    QueueDetailResponse,
    QueueActionResponse,
    QueueCreateResponse,
    QueueConsultResponse,
    QueueRegisterRequest,
)
from app.schemas.biometric_schema import BiometricScanRequest
from app.exceptions.exceptions import QueueException

router = APIRouter()


# ============================================================
# =============== REGISTER / CREATE ===========================
# ============================================================


@router.post("/register", response_model=QueueCreateResponse)
def register_user(
    request: QueueRegisterRequest = Body(...),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Regista um novo usuário e o insere no final da fila."""
    response = create_user_with_biometric_and_queue(db=db, request=request)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return response


# ============================================================
# =============== LIST & CONSULT ==============================
# ============================================================


@router.get("/list", response_model=list[QueueListResponse])
def list_queue(db: Session = Depends(get_db)):
    """Lista os usuários com status 'waiting' ou 'called_pending_verification'."""
    return list_waiting_and_called_items(db)


@router.get("/consult", response_model=QueueConsultResponse)
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


@router.get("/current", response_model=QueueDetailResponse)
def get_current_user(db: Session = Depends(get_db)):
    """Retorna o usuário atualmente em atendimento."""
    return get_active_queue_item(db)


@router.get("/called", response_model=QueueDetailResponse)
def get_called_user(db: Session = Depends(get_db)):
    """Retorna o usuário chamado, pendente de verificação biométrica."""
    return get_pending_verification_item(db)


# ============================================================
# =============== BIOMETRIC SCAN ==============================
# ============================================================


@router.post("/scan", response_model=QueueDetailResponse)
def scan_biometric(
    request: BiometricScanRequest,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Realiza a identificação biométrica.
    - Se o usuário chamado confirmar, muda o status para 'being_served'.
    - Caso não esteja na fila, é reinserido no final.
    """
    queue_dict = process_biometric_scan(db, request.biometric_id)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailResponse(**queue_dict)


# ============================================================
# =============== QUEUE ACTIONS (NEXT / DONE / SKIP) ==========
# ============================================================


@router.put("/next", response_model=QueueActionResponse)
def call_next(db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    """Chama o próximo usuário da fila."""
    next_item = call_next_user(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueActionResponse(
        message="Próximo usuário chamado. Aguardando confirmação biométrica.",
        queue=QueueDetailResponse(**next_item),
    )


@router.put("/done", response_model=QueueActionResponse)
def complete_service(
    db: Session = Depends(get_db), background_tasks: BackgroundTasks = None
):
    """Conclui o atendimento do usuário atualmente em serviço."""
    done_item = complete_active_user_service(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueActionResponse(
        message="Atendimento concluído.",
        queue=QueueDetailResponse(**done_item),
    )


@router.put("/skip", response_model=QueueActionResponse)
def skip_user(db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    """Pula o usuário chamado (ausente) e o reinsere no fim da fila."""
    new_item = skip_called_user(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueActionResponse(
        message="Usuário ausente, reinserido no fim da fila.",
        queue=QueueDetailResponse(**new_item),
    )
