from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.operator_schema import OperatorCreate, OperatorOut
from app.crud.operator_crud import create_operator, get_operator_by_id, get_all_operators, deactivate_operator
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.operator import Operator

router = APIRouter()


# Criar operador (já existe, mantido aqui para contexto)
@router.post("/create", response_model=OperatorOut)
def create_new_operator(
    operator: OperatorCreate,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return create_operator(db, operator.username, operator.password, operator.role)


# Listar todos operadores
@router.get("/", response_model=List[OperatorOut])
def list_operators(
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return get_all_operators(db)


# Buscar operador por ID
@router.get("/{operator_id}", response_model=OperatorOut)
def get_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    operator = get_operator_by_id(db, operator_id)
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")
    return operator


# Desativar operador (soft delete)
@router.delete("/{operator_id}", response_model=OperatorOut)
def disable_operator(
    operator_id: int,
    db: Session = Depends(get_db),
    current_user: Operator = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    operator = deactivate_operator(db, operator_id)
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")
    return operator
