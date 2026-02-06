from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.security import get_current_user
from app.db.database import get_db
from app.helpers.operators import check_permissions
from app.models.enums import OperatorRole
from app.schemas.audit_schema import (
    AuditVerificationDetail,
    AuditChainSummary,
    AuditChainValidationResult,
)
from app.services.audit_service import AuditService

router = APIRouter()


@router.get("/", response_model=List[AuditVerificationDetail])
def list_audits(
    skip: int = Query(0),
    limit: int = Query(100),
    user_id: Optional[int] = Query(None),
    action: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.AUDITOR])
    return AuditService.generate_audit_report(
        db=db,
        user_id=user_id,
        action=action,
        start=start,
        end=end,
        skip=skip,
        limit=limit,
    )


@router.get("/verify-summary", response_model=AuditChainSummary)
def verify_audit_chain_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.AUDITOR])
    records = AuditService.verify_chain(db)
    total = len(records)
    valid_count = sum(r.valid for r in records)
    return AuditChainSummary(
        all_valid=(valid_count == total),
        total_records=total,
        valid_records=valid_count,
        invalid_records=total - valid_count,
    )


@router.get("/verify/{audit_id}", response_model=AuditVerificationDetail)
def verify_single(audit_id: int, db: Session = Depends(get_db)):
    result = AuditService.verify_single_audit(db, audit_id)
    if not result:
        raise HTTPException(
            status_code=404, detail=f"Audit record {audit_id} not found"
        )
    return result


@router.get("/verify", response_model=AuditChainValidationResult)
def verify_audit_chain(db: Session = Depends(get_db)):
    """
    Verifica toda a cadeia de auditoria.
    Retorna um resumo com validade de cada registro.
    """
    records = AuditService.verify_chain(db)
    return AuditChainValidationResult(
        all_valid=all(r.valid for r in records),
        records=records,
    )
