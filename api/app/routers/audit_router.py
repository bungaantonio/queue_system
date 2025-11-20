from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.schemas.audit_schema import (
    AuditChainSummary,
    AuditVerificationDetail,
    AuditChainValidationResult,
)
from app.services.audit_service import AuditService

router = APIRouter()


@router.get("/", response_model=List[AuditVerificationDetail])
def list_audits(
    skip: int = Query(0, description="Número de registros a pular", example=0),
    limit: int = Query(
        100, description="Número máximo de registros retornados", example=100
    ),
    user_id: int | None = Query(
        None, description="Filtrar pelo ID do usuário", example=42
    ),
    action: str | None = Query(None, description="Filtrar pela ação", example="CREATE"),
    start: datetime | None = Query(
        None,
        description="Data inicial no formato ISO 8601",
        example="2025-09-27T00:00:00",
    ),
    end: datetime | None = Query(
        None,
        description="Data final no formato ISO 8601",
        example="2025-09-27T23:59:59",
    ),
    db: Session = Depends(get_db),
):
    """
    Lista registros de auditoria com filtros opcionais e paginação.

    - **user_id**: filtra registros de um usuário específico
    - **action**: filtra registros por tipo de ação
    - **start / end**: filtra registros por intervalo de data
    - **skip / limit**: paginação
    """
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
def verify_audit_chain_summary(db: Session = Depends(get_db)):
    """
    Retorna um resumo da cadeia de auditoria:

    - **all_valid**: todos os registros são válidos?
    - **total_records**: total de registros na cadeia
    - **valid_records**: quantidade de registros válidos
    - **invalid_records**: quantidade de registros inválidos
    """
    records = AuditService.verify_chain(db)
    total = len(records)
    valid_count = sum(r.valid for r in records)
    return AuditChainSummary(
        all_valid=(valid_count == total),
        total_records=total,
        valid_records=valid_count,
        invalid_records=total - valid_count,
    )
