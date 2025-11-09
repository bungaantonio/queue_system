from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.crud.operator_crud import get_operator_by_username


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _get_secret_key_value() -> str:
    """
    Retorna a SECRET_KEY como str — aceita SecretStr ou str.
    """
    secret = settings.SECRET_KEY
    # pydantic SecretStr tem método get_secret_value()
    if hasattr(secret, "get_secret_value"):
        return secret.get_secret_value()
    return str(secret)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire, "sub": data.get("username"), "iat": datetime.now(timezone.utc)})
    secret_key = _get_secret_key_value()
    return jwt.encode(to_encode, secret_key, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        secret_key = _get_secret_key_value()
        return jwt.decode(token, secret_key, algorithms=[settings.ALGORITHM])
    except JWTError:
        return {}


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    username: str = payload.get("sub") if payload else None
    if username is None:
        raise credentials_exception

    user = get_operator_by_username(db, username=username)
    if user is None:
        raise credentials_exception

    return user
