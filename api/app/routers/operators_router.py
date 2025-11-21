from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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


# 🔹 Bootstrap inicial — permite criar o primeiro admin sem autenticação
@router.post("/bootstrap", response_model=OperatorOut)
def bootstrap_admin(operator: OperatorCreate, db: Session = Depends(get_db)):
    existing_operators = get_all_operators(db)
    if existing_operators:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Initial admin already exists",
        )

    if operator.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="First operator must have role 'admin'",
        )

    return create_operator(db, operator.username, operator.password, operator.role)


# 🔹 Criar operador (admin autenticado)
@router.post("/", response_model=OperatorOut)
def create_new_operator(
    operator: OperatorCreate,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    return create_operator(db, operator.username, operator.password, operator.role)


# 🔹 Listar todos operadores
@router.get("/", response_model=List[OperatorOut])
def list_operators(
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    return get_all_operators(db)


# 🔹 Buscar operador por ID
@router.get("/{operator_id}", response_model=OperatorOut)
def get_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")
    return operator


# 🔹 Desativar operador (soft delete)
@router.delete("/{operator_id}", response_model=OperatorOut)
def disable_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )
    operator = deactivate_operator(db, operator_id)
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")
    return operator


@router.put("/{operator_id}", response_model=OperatorOut)
def update_operator_endpoint(
    operator_id: int,
    operator_data: OperatorUpdate,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user),
):
    # 🔹 Verifica se o utilizador atual é admin
    if getattr(current_user, "role", None) != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions"
        )

    # 🔹 Verifica se o operador existe
    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Operator not found"
        )

    # 🔹 Atualiza apenas os campos enviados
    updated_operator = update_operator(
        db, operator_id, role=operator_data.role, password=operator_data.password
    )

    return updated_operator
