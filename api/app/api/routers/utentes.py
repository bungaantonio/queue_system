from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.helpers.response_helpers import ApiResponse, success_response
from app.models.enums import OperatorRole
from app.models.operator import Operator
from app.models.user import User
from app.schemas.user_schema import UserFullResponse

router = APIRouter()


@router.get("/users", response_model=ApiResponse[List[UserFullResponse]])
def list_users(
        db: Session = Depends(get_db),
        current_user: Operator = Depends(require_roles(OperatorRole.ADMIN, OperatorRole.AUDITOR)),
):
    return success_response(db.query(User).all())
