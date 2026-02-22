from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.exceptions import AppException
from app.core.permissions import require_roles
from app.db.database import get_db
from app.helpers.response_helpers import ApiResponse, success_response
from app.models.enums import OperatorRole
from app.schemas.audit_schema import (
    AuditVerificationDetail,
    AuditChainSummary,
    AuditChainValidationResult,
)
from app.services.audit_service import AuditService

router = APIRouter()


@router.get("/", response_model=ApiResponse[List[AuditVerificationDetail]])
def list_audits(
        skip: int = Query(0),
        limit: int = Query(100),
        user_id: Optional[int] = Query(None),
        action: Optional[str] = Query(None),
        start: Optional[datetime] = Query(None),
        end: Optional[datetime] = Query(None),
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    audits = AuditService.generate_audit_report(
        db=db,
        user_id=user_id,
        action=action,
        start=start,
        end=end,
        skip=skip,
        limit=limit,
    )
    return success_response(audits)


@router.get("/verify-summary", response_model=ApiResponse[AuditChainSummary])
def verify_audit_chain_summary(
        request: Request,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    print("Headers recebidos:", request.headers)
    records = AuditService.verify_chain(db)
    total = len(records)
    valid_count = sum(r.valid for r in records)
    summary = AuditChainSummary(
        all_valid=(valid_count == total),
        total_records=total,
        valid_records=valid_count,
        invalid_records=total - valid_count,
    )
    return success_response(summary)


@router.get("/verify/{audit_id}", response_model=ApiResponse[AuditVerificationDetail])
def verify_single(
        audit_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    result = AuditService.verify_single_audit(db, audit_id)
    if not result:
        raise AppException("audit.not_found")
    return success_response(result)


@router.get("/verify", response_model=ApiResponse[AuditChainValidationResult])
def verify_audit_chain(
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    """
    Verifica toda a cadeia de auditoria.
    Retorna um resumo com validade de cada registro.
    """
    records = AuditService.verify_chain(db)
    verify = AuditChainValidationResult(
        all_valid=all(r.valid for r in records),
        records=records,
    )

    return success_response(verify)


@router.patch("/{audit_id}/investigate", response_model=ApiResponse[AuditVerificationDetail])
def investigate_audit(
        audit_id: int,
        note: str,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.AUDITOR)),
):
    result = AuditService.investigate_event(db, audit_id, note, current_user)

    return success_response(result)