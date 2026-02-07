# app/crud/user/create.py
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate

from app.helpers.audit_helpers import audit_log


def create_user(db: Session, user: UserCreate, operator_id: int):
    db_user = db.query(User).filter(User.id_number == user.document_id).first()
    if db_user:
        return db_user

    new_user = User(
        name=user.name,
        id_number=user.document_id,
        phone=user.phone,
        birth_date=user.birth_date,
    )
    db.add(new_user)
    db.flush()

    return new_user
