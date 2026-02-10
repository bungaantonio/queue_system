from sqlalchemy.orm import Session
from app.models.user import User


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_id_number(db: Session, id_number: str):
    return db.query(User).filter(User.id_number == id_number).first()


def get_user_by_phone(db: Session, phone: str):
    return db.query(User).filter(User.phone == phone).first()
