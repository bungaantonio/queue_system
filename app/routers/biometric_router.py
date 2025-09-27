from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import biometric_service
from app.schemas.biometric_schema import BiometricVerifyRequest, BiometricVerifyResponse

router = APIRouter()


@router.post("/verify_called_user", response_model=BiometricVerifyResponse)
def verify_called_user(request: BiometricVerifyRequest, db: Session = Depends(get_db)):
    return biometric_service.verify_called_user(db, request.queue_id, request.biometric_id)
