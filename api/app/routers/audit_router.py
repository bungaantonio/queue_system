from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.core.security import get_current_user
from app.db.database import get_db
from app.helpers.operators import check_permissions
from app.models.enums import OperatorRole
from app.schemas.audit_schema import (
    AuditChainSummary,
    AuditVerificationDetail,
    AuditChainValidationResult,
)
from app.services.audit_service import AuditService

router = APIRouter()


@router.get("/", response_model=List[AuditVerificationDetail])
def list_audits(
    skip: int = Query(0),
    limit: int = Query(100),
    user_id: int | None = Query(None),
    action: str | None = Query(None),
    start: datetime | None = Query(None),
    end: datetime | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Só Auditor pode acessar
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


@router.get("/verify", response_model=AuditChainValidationResult)
def verify_audit_chain(db: Session = Depends(get_db)):
    """
    Verifica a cadeia completa de auditoria e retorna um resumo da validade de cada registro.

    - **all_valid**: indica se todos os registros são válidos
    - **records**: lista detalhada de cada verificação
    """
    records = AuditService.verify_chain(db)
    return AuditChainValidationResult(
        all_valid=all(r.valid for r in records), records=records
    )


@router.get("/verify/{audit_id}", response_model=AuditVerificationDetail)
def verify_single(audit_id: int, db: Session = Depends(get_db)):
    """
    Verifica um registro específico da cadeia de auditoria.

    Retorna detalhes sobre:
    - Hash recalculado
    - Hash armazenado
    - Validação do hash anterior
    - Validade geral do registro
    """
    result = AuditService.verify_single_audit(db, audit_id)
    if not result:
        raise HTTPException(
            status_code=404, detail=f"Audit record {audit_id} not found"
        )
    return result


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
