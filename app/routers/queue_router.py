from fastapi import APIRouter, Depends, HTTPException, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.exceptions.exceptions import BiometricException, QueueException
from app.services import biometric_service, queue_service
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


# ------------------ MANUAL INSERT ------------------
@router.post("/manual_insert", response_model=QueueCreateResponse)
def manual_insert(
    request: QueueInsertRequest, db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    db_user = user_crud.get_user(db, request.user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    queue_item = queue_service.manual_insert(db, db_user.id)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueCreateResponse(
        status="success",
        message="User added to the queue (admin)",
        user=UserFullResponse.from_orm(db_user),
        biometric=None,
        queue=QueueDetailResponse.from_orm(queue_item),
    )


# ------------------ LIST ------------------
@router.get("/list", response_model=dict[str, list[QueueListResponse]])
def list_queue_endpoint(db: Session = Depends(get_db)):
    queue = queue_service.list_waiting_queue(db)
    return {"queue": queue}


# ------------------ CURRENT USER ------------------
@router.get("/current", response_model=QueueListResponse)
def get_current_user_endpoint(db: Session = Depends(get_db)):
    current_item = queue_service.get_current(db)
    if not current_item:
        raise HTTPException(status_code=404, detail="Nenhum usuário em atendimento")
    return current_item


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


# ------------------- SCAN BIOMETRIC ------------------
@router.post("/scan", response_model=QueueDetailResponse)
def scan_biometric_endpoint(
    request: BiometricScanRequest,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    try:
        queue_item = queue_service.handle_biometric_scan(db, request.biometric_id)
    except BiometricException as e:
        raise HTTPException(status_code=404, detail=e.message)
    except QueueException as e:
        raise HTTPException(status_code=400, detail=e.message)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDetailResponse.from_orm(queue_item)


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
    done_item = queue_service.finish_current(db)

    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return QueueDoneResponse(
        message="Atendimento concluído",
        queue=QueueDetailResponse.from_orm(done_item),
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
