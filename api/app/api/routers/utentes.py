from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.helpers.operators import check_permissions
from app.models.enums import OperatorRole
from app.models.operator import Operator
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.user_schema import UserFullResponse


router = APIRouter()


@router.get("/users", response_model=List[UserFullResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    # O React Admin (getList) espera uma lista
    check_permissions(
        current_user, allowed_roles=[OperatorRole.ADMIN, OperatorRole.ATTENDANT]
    )
    return db.query(User).all()
