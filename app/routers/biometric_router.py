from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import biometric_service
from app.helpers.queue_broadcast import broadcast_state
from app.schemas.biometric_schema import BiometricVerifyRequest, BiometricVerifyResponse

router = APIRouter()


@router.post("/verify_called_user", response_model=BiometricVerifyResponse)
def verify_called_user(
    request: BiometricVerifyRequest,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    result = biometric_service.verify_called_user(
        db,
        request.queue_id,
        request.biometric_id,
    )

    # agenda o broadcast depois da alteração de estado
    if background_tasks:
        background_tasks.add_task(broadcast_state, db)

    return result
