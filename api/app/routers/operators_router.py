from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.helpers.operators import check_permissions
from app.models.enums import OperatorRole
from app.schemas.operator_schema import OperatorCreate, OperatorUpdate, OperatorOut
from app.crud.operator_crud import (
    create_operator,
    get_operator_by_id,
    get_all_operators,
    deactivate_operator,
    update_operator,
)
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.operator import Operator

router = APIRouter()


# 🔹 Bootstrap inicial — criar primeiro admin sem autenticação
@router.post("/bootstrap", response_model=OperatorOut)
def bootstrap_admin(operator: OperatorCreate, db: Session = Depends(get_db)):
    existing_operators = get_all_operators(db)
    if existing_operators:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Initial admin already exists",
        )
    if operator.role != OperatorRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="First operator must have role 'admin'",
        )
    return create_operator(db, operator.username, operator.password, operator.role)


# 🔹 Criar operador (apenas admin)
@router.post("/", response_model=OperatorOut)
def create_new_operator(
    operator: OperatorCreate,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    return create_operator(db, operator.username, operator.password, operator.role)


# 🔹 Listar operadores (admin + auditor)
@router.get("/", response_model=List[OperatorOut])
def list_operators(
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    check_permissions(
        current_user, allowed_roles=[OperatorRole.ADMIN, OperatorRole.AUDITOR]
    )
    return get_all_operators(db)


# 🔹 Buscar operador por ID (admin + auditor)
@router.get("/{operator_id}", response_model=OperatorOut)
def get_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    check_permissions(
        current_user, allowed_roles=[OperatorRole.ADMIN, OperatorRole.AUDITOR]
    )
    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Operator not found"
        )
    return operator


# 🔹 Desativar operador (admin)
@router.delete("/{operator_id}", response_model=OperatorOut)
def disable_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    operator = deactivate_operator(db, operator_id)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Operator not found"
        )
    return operator


# 🔹 Atualizar operador (admin)
@router.put("/{operator_id}", response_model=OperatorOut)
def update_operator_endpoint(
    operator_id: int,
    operator_data: OperatorUpdate,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    check_permissions(current_user, allowed_roles=[OperatorRole.ADMIN])
    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Operator not found"
        )

    # Atualiza apenas role e password (username não se altera)
    updated_operator = update_operator(
        db, operator_id, role=operator_data.role, password=operator_data.password
    )
    return updated_operator
