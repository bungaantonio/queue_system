from fastapi import HTTPException, status
from app.models.operator import Operator


def check_permissions(user: Operator, allowed_roles: list[str]):
    if getattr(user, "role", None) not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
