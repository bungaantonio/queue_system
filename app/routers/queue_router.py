from fastapi import APIRouter, Depends, HTTPException, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.exceptions.exceptions import BiometricException, QueueException
from app.helpers.queue_helpers import map_to_queue_detail, map_to_queue_list
from app.services import queue_service
from app.helpers.queue_broadcast import broadcast_state
from app.crud import user_crud
from app.schemas.queue_schema import (
    QueueConsultResponse,
    QueueCreateResponse,
    QueueDetailResponse,
    QueueListResponse,
    QueueNextResponse,
    QueueDoneResponse,
    QueueSkipResponse,
    QueueInsertRequest,
    RegisterRequest,
)
from app.schemas.user_schema import UserFullResponse
from app.schemas.biometric_schema import BiometricScanRequest

router = APIRouter()


# ------------------ REGISTER ------------------
@router.post("/register", response_model=QueueCreateResponse)
def register_user_endpoint(
    db: Session = Depends(get_db),
    request: RegisterRequest = Body(...),
    background_tasks: BackgroundTasks = None,
):
    response = queue_service.register_user(db=db, request=request)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return response


# ------------------ LIST ------------------
@router.get("/list", response_model=list[QueueListResponse])
def list_queue(db: Session = Depends(get_db)):
    """
    Endpoint que retorna a fila atual.
    """
    return queue_service.list_waiting_queue(db)


# ------------------ CURRENT USER ------------------
@router.get("/current")
def get_current_user_endpoint(db: Session = Depends(get_db)):
    queue_item = queue_service.get_current(db)
    if not queue_item:
        raise QueueException("queue_not_found")
    return queue_item


# ------------------ CALLED USER (PENDING VERIFICATION) ------------------
@router.get("/called", response_model=QueueDetailResponse)
def get_called_user(db: Session = Depends(get_db)):
    called = queue_service.get_called(db)
    if not called:
        raise QueueException("queue_not_found")
    return called


# ------------------ CONSULT USER IN QUEUE ------------------
@router.get("/consult", response_model=QueueConsultResponse)
def consult_user_in_queue(
    id_number: str = Query(None, description="Número de bilhete"),
    phone: str = Query(None, description="Número de telefone"),
    db: Session = Depends(get_db),
):
    try:
        return queue_service.consult_user_in_queue_by_document_or_phone(
            db, id_number, phone
        )
    except QueueException as e:
        raise HTTPException(status_code=404, detail=e.args[0])


@router.post("/scan", response_model=QueueDetailResponse)
def scan_biometric_endpoint(
    request: BiometricScanRequest,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    try:
        queue_dict = queue_service.handle_biometric_scan(db, request.biometric_id)
    except BiometricException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except QueueException as e:
        raise HTTPException(status_code=400, detail=e.message)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailResponse(**queue_dict)


# ------------------ NEXT ------------------
@router.put("/next", response_model=QueueNextResponse)
def call_next_endpoint(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    next_item = queue_service.call_next(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueNextResponse(
        message="Próximo chamado. Aguardando confirmação biométrica",
        queue=QueueDetailResponse.from_orm(next_item),
    )


# ------------------ DONE ------------------
@router.put("/done", response_model=QueueDoneResponse)
def finish_service_endpoint(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    done_item_dict = queue_service.finish_current(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDoneResponse(
        message="Atendimento concluído",
       queue=QueueDetailResponse(**done_item_dict),
    )


# ------------------ SKIP ------------------
@router.put("/skip", response_model=QueueSkipResponse)
def skip_user(
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    new_item = queue_service.skip_current(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueSkipResponse(
        message="Usuário ausente, reinserido no fim da fila",
        old_id=new_item.user_id,
        new_id=new_item.id,
        position=new_item.position,
        status=new_item.status,
    )
