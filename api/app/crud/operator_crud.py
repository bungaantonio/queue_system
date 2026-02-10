from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.operator import Operator


def get_operator_by_id(db: Session, operator_id: int) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.id == operator_id).first()


def get_operator_by_username(db: Session, username: str) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.username == username).first()


def get_all_operators(db: Session):
    return db.query(Operator).all()


def create_operator_record(
        db: Session, username: str, hashed_password: str, role: str
) -> Operator:
    """Cria o registro no banco. Não faz commit."""
    db_obj = Operator(
        username=username, hashed_password=hashed_password, role=role, active=True
    )
    db.add(db_obj)
    db.flush()  # Gera o ID para ser usado na auditoria
    return db_obj


def update_operator_record(db: Session, db_obj: Operator) -> Operator:
    """Marca o objeto para atualização. Não faz commit."""
    db.add(db_obj)
    db.flush()
    return db_obj
