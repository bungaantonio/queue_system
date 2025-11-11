from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions.exceptions import QueueException, BiometricException
from app.helpers.logger import get_logger

logger = get_logger(__name__)


def register_exception_handlers(app):
    @app.exception_handler(QueueException)
    async def queue_exception_handler(request: Request, exc: QueueException):
        logger.debug(
            f"QueueException: {exc}",
            extra={"extra_data": {"path": str(request.url), "exception": str(exc)}},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.code,
                "detail": exc.message,
            },
        )

    @app.exception_handler(BiometricException)
    async def biometric_exception_handler(request: Request, exc: BiometricException):
        logger.debug(
            f"BiometricException: {exc}",
            extra={"extra_data": {"path": str(request.url), "exception": str(exc)}},
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "code": exc.code,
                "detail": exc.message,
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception):
        logger.exception(
            f"Unhandled exception: {exc}",
            extra={"extra_data": {"path": str(request.url), "exception": str(exc)}},
        )
        return JSONResponse(
            status_code=500,
            content={
                "code": "internal_server_error",
                "detail": "Erro interno no servidor",
            },
        )
