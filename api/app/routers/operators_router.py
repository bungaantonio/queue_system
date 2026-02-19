from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.permissions import require_roles
from app.helpers.response_helpers import ApiResponse, success_response
from app.models.enums import OperatorRole
from app.db.database import get_db
from app.schemas.operator_schemas import (
    OperatorCreateRequest,
    OperatorUpdateRequest,
    OperatorResponse,
)
from app.services.operator_service import OperatorService

router = APIRouter()


def _deactivate_operator_or_404(
        db: Session,
        operator_id: int,
        acting_operator_id: int,
) -> OperatorResponse:
    op = OperatorService.deactivate_operator(
        db, operator_id, acting_operator_id=acting_operator_id
    )
    if not op:
        raise AppException("operator.not_found")
    return op


def _activate_operator_or_404(
        db: Session,
        operator_id: int,
        acting_operator_id: int,
) -> OperatorResponse:
    op = OperatorService.activate_operator(
        db, operator_id, acting_operator_id=acting_operator_id
    )
    if not op:
        raise AppException("operator.not_found")
    return op


def _delete_operator_or_404(
        db: Session,
        operator_id: int,
        acting_operator_id: int,
) -> OperatorResponse:
    op = OperatorService.delete_operator(
        db, operator_id, acting_operator_id=acting_operator_id
    )
    if not op:
        raise AppException("operator.not_found")
    return op


@router.post("/", response_model=OperatorResponse)
def create_operator(
        payload: OperatorCreateRequest,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN)),
):
    return OperatorService.create_operator(
        db, payload, acting_operator_id=current_user.id
    )


@router.get("/", response_model=ApiResponse[List[OperatorResponse]])
def list_operators(
        db: Session = Depends(get_db), current_user=Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR))

):
    return success_response(OperatorService.get_all(db))


@router.get("/{operator_id}", response_model=ApiResponse[OperatorResponse])
def get_operator(
        operator_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR))
):
    op = OperatorService.get_by_id(db, operator_id)
    if not op:
        raise AppException("operator.not_found")

    return success_response(op)


@router.delete("/{operator_id}", response_model=ApiResponse[OperatorResponse])
def delete_operator(
        operator_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN))
):
    return success_response(_delete_operator_or_404(
        db=db,
        operator_id=operator_id,
        acting_operator_id=current_user.id,
    ))


@router.patch("/{operator_id}/deactivate", response_model=ApiResponse[OperatorResponse])
def deactivate_operator(
        operator_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN))
):
    return success_response(_deactivate_operator_or_404(
        db=db,
        operator_id=operator_id,
        acting_operator_id=current_user.id,
    ))


@router.patch("/{operator_id}/activate", response_model=ApiResponse[OperatorResponse])
def activate_operator(
        operator_id: int,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN))
):
    return success_response(_activate_operator_or_404(
        db=db,
        operator_id=operator_id,
        acting_operator_id=current_user.id,
    ))


@router.put("/{operator_id}", response_model=ApiResponse[OperatorResponse])
def update_operator(
        operator_id: int,
        payload: OperatorUpdateRequest,
        db: Session = Depends(get_db),
        current_user=Depends(require_roles(OperatorRole.ADMIN))
):
    op = OperatorService.update_operator(
        db, operator_id, payload, acting_operator_id=current_user.id
    )
    if not op:
        raise AppException("operator.not_found")
    return success_response(op) 
