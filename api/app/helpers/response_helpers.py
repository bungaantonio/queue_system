# app/core/response_helpers.py
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")  # Tipo genérico para o conteúdo da resposta


class ApiResponse(GenericModel, Generic[T]):
    """
    Wrapper de resposta padronizado para todos os endpoints.

    Attributes:
        success (bool): Indica se a operação foi bem-sucedida.
        data (T | None): Dados retornados pela operação (tipo genérico).
        error (dict | None): Informações de erro, se houver.
    """
    success: bool
    data: Optional[T] = None
    error: Optional[dict] = None


def success_response(data: T) -> ApiResponse[T]:
    """
    Cria uma resposta de sucesso padronizada.

    Args:
        data (T): Dados do endpoint.

    Returns:
        ApiResponse[T]: Objeto compatível com FastAPI para validação.
    """
    return ApiResponse(success=True, data=data, error=None)
