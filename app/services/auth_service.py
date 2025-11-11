from datetime import timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import create_access_token
from app.crud.operator_crud import get_operator_by_username
from app.helpers.password import verify_password
from app.helpers.logger import get_logger

logger = get_logger(__name__)


def authenticate_user(db: Session, username: str, password: str):
    user = get_operator_by_username(db, username)
    if not user:
        logger.warning("Tentativa de login com usuário inexistente", extra={"extra_data": {"username": username}})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(password, user.hashed_password):
        logger.warning("Senha incorreta para usuário", extra={"extra_data": {"username": username}})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.info("Usuário autenticado com sucesso", extra={"extra_data": {"username": username, "role": user.role}})
    return user


def create_user_token(user) -> str:
    data = {"username": user.username, "role": user.role}
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data, expires_delta=access_token_expires)
    logger.debug("Token JWT criado para usuário", extra={"extra_data": {"username": user.username, "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES}})
    return token
