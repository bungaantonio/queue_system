import logging
from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.exceptions import AppException

logger = logging.getLogger(__name__)

def register_exception_handlers(app):
    """
    Regista handlers globais para AppException e erros genéricos.
    """

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        """
        Interceta qualquer AppException lançada e formata a resposta.
        """
        logger.info(f"AppException: {exc}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "code": exc.detail["code"],
                    "message": exc.detail["message"],
                },
                "data": None,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        """
        Captura qualquer exceção não tratada.
        """
        logger.exception(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "code": "internal_server_error",
                    "message": "Erro interno no servidor",
                },
                "data": None,
            },
        )
