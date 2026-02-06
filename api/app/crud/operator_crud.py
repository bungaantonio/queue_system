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

    # operador que criou = operator.id, usuário afetado = None (ninguém ainda)
    AuditService.log_action(
        db,
        operator_id=operator.id,  # quem fez a ação
        user_id=None,  # usuário que participou, neste caso não há
        action=AuditAction.OPERATOR_CREATED,
        details={
            "operator_id": operator.id,
            "username": operator.username,
            "role": role,
        },
    )

    return operator


def deactivate_operator(db: Session, operator_id: int) -> Optional[Operator]:
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if operator:
        operator.active = False
        db.commit()
        db.refresh(operator)

        # operador que fez a ação = ??? (quem chamou a função, pode ser passado como argumento)
        AuditService.log_action(
            db,
            operator_id=operator.id,  # neste caso ainda usamos o próprio para simplificar
            user_id=None,  # usuário afetado = operador que foi desativado?
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
    acting_operator_id: Optional[int] = None,  # quem executa a atualização
) -> Optional[Operator]:
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if not operator:
        return None

    if username is not None:
        setattr(operator, "username", username)
    if role is not None:
        setattr(operator, "role", role)
    if password:
        setattr(operator, "hashed_password", get_password_hash(password))

    db.commit()
    db.refresh(operator)

    AuditService.log_action(
        db,
        operator_id=acting_operator_id,  # quem fez a ação
        user_id=operator.id,  # quem foi afetado
        action=AuditAction.OPERATOR_UPDATED,
        details={
            "operator_id": operator.id,
            "username": operator.username,
            "role": operator.role,
        },
    )
    return operator


def get_operator_by_username(db: Session, username: str) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.username == username).first()


def get_operator_by_id(db: Session, operator_id: int) -> Optional[Operator]:
    return db.query(Operator).filter(Operator.id == operator_id).first()


def get_all_operators(db: Session) -> List[Operator]:
    return db.query(Operator).all()
