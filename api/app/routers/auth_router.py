from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.db.database import get_db
from app.models.models import RefreshToken
from app.models.operator import Operator
from app.schemas.auth_schema import LoginSchema, LogoutSchema
from app.services.auth_service import (
    authenticate_user,
    create_user_token,
    create_refresh_token,
)

router = APIRouter()


@router.post("/login")
def login(form_data: LoginSchema, db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)

    access_token = create_user_token(user)
    refresh_token = create_refresh_token(db, user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/logout")
def logout(data: LogoutSchema, db: Session = Depends(get_db)):
    token_entry = (
        db.query(RefreshToken).filter(RefreshToken.token == data.refresh_token).first()
    )

    if token_entry:
        token_entry.revoked = True
        db.commit()

    return {"detail": "Logged out"}


@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):

    token_entry = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == refresh_token, RefreshToken.revoked == False)
        .first()
    )

    if not token_entry:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if token_entry.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired")

    user = db.query(Operator).filter(Operator.id == token_entry.user_id).first()

    new_access_token = create_user_token(user)

    return {"access_token": new_access_token, "token_type": "bearer"}
