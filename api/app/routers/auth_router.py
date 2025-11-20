from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth_schema import Token, LoginSchema
from app.services.auth_service import authenticate_user, create_user_token

router = APIRouter()


@router.post("/login", response_model=Token)
def login(form_data: LoginSchema, db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    token = create_user_token(user)
    return {"access_token": token, "token_type": "bearer"}