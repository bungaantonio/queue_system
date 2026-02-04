from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserFullResponse


router = APIRouter()


@router.get("/users", response_model=List[UserFullResponse])
def list_users(db: Session = Depends(get_db)):
    # O React Admin (getList) espera uma lista
    return db.query(User).all()
