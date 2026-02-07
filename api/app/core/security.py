from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.crud.operator_crud import get_operator_by_username

# Obrigatório (para endpoints humanos)
oauth2_scheme_required = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    auto_error=True,
)

# Opcional (para endpoints híbridos)
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    auto_error=False,
)


def _get_secret_key_value() -> str:
    """
    Retorna a SECRET_KEY como str — aceita SecretStr ou str.
    """
    secret = settings.SECRET_KEY
    if hasattr(secret, "get_secret_value"):
        return secret.get_secret_value()
    return str(secret)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)

    expire = now + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update(
        {"sub": data.get("username"), "iat": now, "exp": expire, "jti": uuid4().hex}
    )

    secret_key = _get_secret_key_value()
    return jwt.encode(to_encode, secret_key, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        secret_key = _get_secret_key_value()
        return jwt.decode(token, secret_key, algorithms=[settings.ALGORITHM])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    token: str = Depends(oauth2_scheme_required), db: Session = Depends(get_db)
):
    """
    Retorna o operador logado via JWT.
    Lança exceção se não houver token ou se for inválido.
    """
    payload = decode_access_token(token)
    username = payload.get("sub")
    if not username:
        raise HTTPException(
            status_code=401, detail="As credenciais de autenticação são inválidas"
        )

    user = get_operator_by_username(db, username=username)
    if user is None:
        raise HTTPException(
            status_code=401, detail="As credenciais de autenticação são inválidas"
        )

    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
):
    """
    Retorna o operador logado via JWT, ou None se não houver token válido.
    Não lança exceção.
    """
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        if not username:
            return None
        user = get_operator_by_username(db, username=username)
        return user
    except JWTError:
        return None


def resolve_operator_with_system_fallback(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
):
    """
    Retorna o operador ativo:
      - Humano logado, se houver token válido
      - SYSTEM (biometric_gateway) como fallback
    """
    if current_user:
        return current_user

    system_operator = get_operator_by_username(db, username="biometric_gateway")
    if not system_operator:
        raise RuntimeError("SYSTEM operator não encontrado no banco!")
    return system_operator


def get_operator_id(current_user=Depends(get_current_user)) -> int:
    """
    Retorna apenas o `ID` do operador logado.
    Continua disponível para endpoints que só aceitam operador humano.
    """
    return current_user.id
