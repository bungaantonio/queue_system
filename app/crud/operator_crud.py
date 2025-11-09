from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.operator import Operator
from app.helpers.password import get_password_hash


def create_operator(db: Session, username: str, password: str, role: str) -> Operator:
    hashed = get_password_hash(password)
    user = Operator(username=username, hashed_password=hashed, role=role, active=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_operator_by_username(db: Session, username: str) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.username == username).first()


def get_operator_by_id(db: Session, operator_id: int) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.id == operator_id).first()


def get_all_operators(db: Session) -> List[Operator]:
    return db.query(Operator).all()


def deactivate_operator(db: Session, operator_id: int) -> Optional[Operator]:
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if operator:
        operator.active = False
        db.commit()
        db.refresh(operator)
    return operator
