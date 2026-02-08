from datetime import datetime, timedelta, timezone
import secrets
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppException
from app.core.security import create_access_token
from app.crud.operator_crud import get_operator_by_username
from app.models.models import RefreshToken
from app.helpers.password import verify_password


def authenticate_user(db: Session, username: str, password: str):
    user = get_operator_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        raise AppException("auth.invalid_credentials")
    return user


def create_user_token(user) -> str:
    data = {"username": user.username, "role": user.role}
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return create_access_token(data, expires_delta=access_token_expires)


def create_refresh_token(db: Session, user_id: int):
    token = secrets.token_urlsafe(48)

    expires = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    refresh = RefreshToken(token=token, user_id=user_id, expires_at=expires)

    db.add(refresh)
    db.commit()
    db.refresh(refresh)

    return token
