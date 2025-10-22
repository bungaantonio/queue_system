from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserUpdate


def create_user(db: Session, user: UserCreate):
    # primeiro verifica se já existe
    db_user = db.query(User).filter(User.id_number == user.document_id).first()
    if db_user:
        return db_user
    # cria novo
    new_user = User(
        name=user.name,
        id_number=user.document_id,
        phone=user.phone,
        birth_date=user.birth_date,
    )
    db.add(new_user)
    db.flush()
    return new_user


def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    for key, value in user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.flush()
    return db_user


def get_user_by_id_number(db: Session, id_number: str):
    return db.query(User).filter(User.id_number == id_number).first()


def get_user_by_phone(db: Session, phone: str):
    return db.query(User).filter(User.phone == phone).first()
