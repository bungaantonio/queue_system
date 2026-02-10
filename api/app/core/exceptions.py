from fastapi import HTTPException
from app.core.errors import ERRORS

class AppException(HTTPException):
    """Exceção base do sistema, com código + mensagem + status padronizados."""

    def __init__(self, code: str):
        if code not in ERRORS:
            raise ValueError(f"Erro não registado: {code}")

        status_code, message = ERRORS[code]
        super().__init__(status_code=status_code, detail={
            "code": code,
            "message": message,
        })
