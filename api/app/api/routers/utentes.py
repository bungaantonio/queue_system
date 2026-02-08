from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.enums import OperatorRole
from app.models.operator import Operator
from app.models.user import User
from app.schemas.user_schema import UserFullResponse


router = APIRouter()


@router.get("/users", response_model=List[UserFullResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR)),
):
    return db.query(User).all()
