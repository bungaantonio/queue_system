from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import user
from app.models.enums import AuditAction
from app.models.operator import Operator
from app.helpers.password import get_password_hash
from app.services.audit_service import AuditService


def create_operator(db: Session, username: str, password: str, role: str) -> Operator:
    hashed = get_password_hash(password)
    operator = Operator(
        username=username, hashed_password=hashed, role=role, active=True
    )
    db.add(operator)
    db.commit()
    db.refresh(operator)

    AuditService.log_action(
        db,
        user_id=operator.id,
        action=AuditAction.OPERATOR_CREATED,
        details={
            "operator_id": operator.id,
            "username": operator.username,
            "role": role,
        },
    )

    return operator


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

        AuditService.log_action(
            db,
            user_id=operator.id,
            action=AuditAction.OPERATOR_DEACTIVATED,
            details={"operator_id": operator.id, "username": operator.username},
        )

    return operator


def update_operator(
    db: Session,
    operator_id: int,
    username: Optional[str] = None,
    password: Optional[str] = None,
    role: Optional[str] = None,
) -> Optional[Operator]:
    """
    Atualiza campos de um operador.
    - Se username, password ou role forem fornecidos, atualiza esses campos.
    - Password será sempre guardada com hash.
    """
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if not operator:
        return None

    if username is not None:
        setattr(operator, "username", username)
    if role is not None:
        setattr(operator, "role", role)
    if password:
        from app.helpers.password import get_password_hash

        setattr(operator, "hashed_password", get_password_hash(password))

    db.commit()
    db.refresh(operator)

    AuditService.log_action(
        db,
        user_id=operator.id,
        action=AuditAction.OPERATOR_UPDATED,
        details={
            "operator_id": operator.id,
            "username": operator.username,
            "role": operator.role,
        },
    )
    return operator
