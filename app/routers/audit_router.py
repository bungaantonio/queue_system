from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.audit_schema import AuditResponse
from app.services import audit_service
from app.crud import audit_crud

router = APIRouter()


@router.get("/", response_model=List[AuditResponse])
def list_audits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return audit_crud.get_audits(db, skip=skip, limit=limit)


@router.get("/verify")
def verify_audit_chain(db: Session = Depends(get_db)):
    return {"chain_valid": audit_service.verify_chain(db)}


@router.get("/verify/{audit_id}")
def verify_single(audit_id: int, db: Session = Depends(get_db)):
    result = audit_service.verify_single_audit(db, audit_id)
    if not result["exists"]:
        raise HTTPException(status_code=404, detail="Audit record not found")
    return result
