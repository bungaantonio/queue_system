# app/exceptions/handlers.py

from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions.exceptions import BiometricException, QueueException


def register_exception_handlers(app):
    @app.exception_handler(QueueException)
    async def queue_exception_handler(request: Request, exc: QueueException):
        return JSONResponse(
            status_code=exc.status,
            content={"error": exc.code, "detail": exc.message},
        )

    @app.exception_handler(BiometricException)
    async def biometric_exception_handler(request: Request, exc: BiometricException):
        return JSONResponse(
            status_code=exc.status,
            content={"error": exc.code, "detail": exc.message},
        )
