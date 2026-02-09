# app/routers/auth.py
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from app.core.exceptions import AppException
from app.db.database import get_db
from app.models.models import RefreshToken
from app.models.operator import Operator
from app.schemas.auth_schema import (
    LoginSchema,
    LogoutSchema,
    RefreshTokenSchema,
    LoginResponseData,
    RefreshResponseData,
    LogoutResponseData
)

from app.services.auth_service import authenticate_user, create_user_token, create_refresh_token
from app.helpers.response_helpers import success_response, ApiResponse

router = APIRouter()


@router.post("/login", response_model=ApiResponse[LoginResponseData])
def login(payload: LoginSchema, db: Session = Depends(get_db), response: Response = None):
    """
    🔹 Autenticação do usuário

    Retorna:
    {
        "success": true,
        "data": {
            "access_token": "...",
            "refresh_token": "...",
            "token_type": "bearer"
        },
        "error": null
    }

    Alternativa segura:
    - Em produção, é recomendável **não expor refresh_token no JSON**.
    - Pode ser enviado como **cookie HTTPOnly**, evitando que front-end acesse diretamente.
    - Exemplo:
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,  # HTTPS obrigatório
            samesite="lax",
            max_age=3600*24*30  # validade do refresh
        )
    """

    user = authenticate_user(db, payload.username, payload.password)

    access_token = create_user_token(user)
    refresh_token = create_refresh_token(db, user.id)

    payload = LoginResponseData(
        access_token=access_token,
        refresh_token=refresh_token,
    )

    return success_response(payload)


@router.post("/refresh", response_model=ApiResponse[RefreshResponseData])
def refresh_token(payload: RefreshTokenSchema, db: Session = Depends(get_db), response: Response = None):
    """
    🔹 Gera novo access token usando refresh token válido

    Retorna:
    {
        "success": true,
        "data": {
            "access_token": "...",
            "token_type": "bearer"
        },
        "error": null
    }

    Alternativa cookie:
    - Se refresh_token estiver em cookie HTTPOnly, basta ler do cookie:
        refresh_token = request.cookies.get("refresh_token")
    - Não expor no body JSON.
    """

    token_entry = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == payload.refresh_token, RefreshToken.revoked == False)
        .first()
    )

    if not token_entry:
        raise AppException("auth.refresh_invalid")

    if token_entry.expires_at < datetime.now(timezone.utc):
        raise AppException("auth.refresh_expired")

    user = db.query(Operator).filter(Operator.id == token_entry.user_id).first()

    new_access_token = create_user_token(user)

    payload = RefreshResponseData(access_token=new_access_token)
    return success_response(payload)


@router.post("/logout", response_model=ApiResponse[LogoutResponseData])
def logout(data: LogoutSchema, db: Session = Depends(get_db), response: Response = None):
    """
    🔹 Revoga o refresh token enviado e confirma logout

    Retorna:
    {
        "success": true,
        "data": {
            "message": "Logged out"
        },
        "error": null
    }

    Alternativa cookie:
    - Se o refresh token estiver no cookie HTTPOnly, basta:
        response.delete_cookie("refresh_token")
    - Evita envio de token no JSON e aumenta segurança.
    """

    token_entry = (
        db.query(RefreshToken).filter(RefreshToken.token == data.refresh_token).first()
    )

    if token_entry:
        token_entry.revoked = True
        db.commit()

    payload = LogoutResponseData(message="Logged out")
    return success_response(payload)
