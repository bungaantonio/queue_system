from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.helpers.operators import check_permissions
from app.models.enums import OperatorRole
from app.db.database import get_db
from app.core.security import get_current_user
from app.schemas.operator_schemas import (
    OperatorCreateRequest,
    OperatorUpdateRequest,
    OperatorResponse,
)
from app.services.operator_service import OperatorService

router = APIRouter()


@router.post("/", response_model=OperatorResponse)
def create_operator(
    payload: OperatorCreateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    return OperatorService.create_operator(
        db, payload, acting_operator_id=current_user.id
    )


@router.get("/", response_model=List[OperatorResponse])
def list_operators(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    check_permissions(
        current_user, allowed_roles=[OperatorRole.ADMIN, OperatorRole.AUDITOR]
    )
    return OperatorService.get_all(db)


@router.get("/{operator_id}", response_model=OperatorResponse)
def get_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(
        current_user, allowed_roles=[OperatorRole.ADMIN, OperatorRole.AUDITOR]
    )
    op = OperatorService.get_by_id(db, operator_id)
    if not op:
        raise HTTPException(status_code=404, detail="Operator not found")
    return op


@router.delete("/{operator_id}", response_model=OperatorResponse)
def delete_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    op = OperatorService.deactivate_operator(
        db, operator_id, acting_operator_id=current_user.id
    )
    if not op:
        raise HTTPException(status_code=404, detail="Operator not found")
    return op


@router.put("/{operator_id}", response_model=OperatorResponse)
def update_operator(
    operator_id: int,
    payload: OperatorUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    op = OperatorService.update_operator(
        db, operator_id, payload, acting_operator_id=current_user.id
    )
    if not op:
        raise HTTPException(status_code=404, detail="Operator not found")
    return op
