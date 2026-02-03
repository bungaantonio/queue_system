from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions.exceptions import QueueException, BiometricException
import logging

logger = logging.getLogger(__name__)


def register_exception_handlers(app):
    @app.exception_handler(QueueException)
    async def queue_exception_handler(request: Request, exc: QueueException):
        logger.info(f"QueueException: {exc}")
        # Mantém 200/400/404/409 conforme novo mapeamento
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.code,
                "detail": exc.message,
            },
        )

    @app.exception_handler(BiometricException)
    async def biometric_exception_handler(request: Request, exc: BiometricException):
        logger.info(f"BiometricException: {exc}")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.code,
                "detail": exc.message,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(f"Unhandled exception: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "code": "internal_server_error",
                "detail": "Erro interno no servidor",
            },
        )
