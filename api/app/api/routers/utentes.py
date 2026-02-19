from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import AppException
from app.core.permissions import require_roles
from app.crud.user.create import create_user
from app.crud.user.read import get_user
from app.crud.user.update import update_user
from app.db.database import get_db
from app.helpers.response_helpers import ApiResponse, success_response
from app.models.enums import OperatorRole
from app.models.operator import Operator
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserFullResponse, UserUpdate

router = APIRouter()


@router.get("/users", response_model=ApiResponse[List[UserFullResponse]])
def list_users(
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR, OperatorRole.ATTENDANT)),
):
    return success_response(db.query(User).all())


@router.get("/users/{user_id}", response_model=ApiResponse[UserFullResponse])
def get_user_by_id(
        user_id: int,
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR, OperatorRole.ATTENDANT)),
):
    user = get_user(db, user_id)
    if not user:
        raise AppException("queue.user_not_found")
    return success_response(user)


@router.post("/users", response_model=ApiResponse[UserFullResponse])
def create_new_user(
        payload: UserCreate,
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.ATTENDANT)),
):
    user = create_user(db, payload, operator_id=current_user.id)
    db.commit()
    db.refresh(user)
    return success_response(user)


@router.put("/users/{user_id}", response_model=ApiResponse[UserFullResponse])
def update_existing_user(
        user_id: int,
        payload: UserUpdate,
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.ATTENDANT)),
):
    user = update_user(db, user_id, payload)
    if not user:
        raise AppException("queue.user_not_found")
    db.commit()
    db.refresh(user)
    return success_response(user)


@router.delete("/users/{user_id}", response_model=ApiResponse[UserFullResponse])
def delete_user(
        user_id: int,
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.ATTENDANT)),
):
    user = get_user(db, user_id)
    if not user:
        raise AppException("queue.user_not_found")

    db.delete(user)
    db.commit()
    return success_response(user)
