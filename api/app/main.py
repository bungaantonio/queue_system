from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions.handlers import register_exception_handlers
from app.routers import (
    auth_router,
    dedicated_router,
    operators_router,
    audit_router,
    queue_stream_router,
)

from app.db.base import Base
from app.db.database import engine

from app.routers.queue_router import queue_api
from app.routers.biometric_router import biometrics_api
from app.routers.monitoring_router import monitoring_router, setup_monitoring_middleware
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

origins = [
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    # depois pode adicionar o domínio real (ex: https://painel.fila.ao)
]


app = FastAPI(title="Sistema de Gestão de Filas")


# Apenas cria as tabelas se ainda não existirem
# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Sistema de Gestão de Filas ativo",
        "endpoints": {
            "health": "/api/v1/health",
            "metrics": "/api/v1/metrics",
            "docs": "/docs",
            "openapi": "/openapi.json",
        },
    }


# Middleware global
setup_monitoring_middleware(app)

app.include_router(monitoring_router, prefix="/api/v1/monitoring")

app.include_router(queue_api.router, prefix="/api/v1/queue", tags=["Queue"])
app.include_router(
    queue_stream_router.router, prefix="/api/v1/sse", tags=["Queue Stream"]
)
# app.include_router(user_router.router, prefix="/users", tags=["Users"])
app.include_router(
    biometrics_api.router, prefix="/api/v1/biometrics", tags=["Biometrics"]
)
app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(operators_router.router, prefix="/operators", tags=["operators"])
app.include_router(
    audit_router.router,
    prefix="/audit",
    tags=["Audit"],
    responses={404: {"description": "Registro não encontrado"}},
)

app.include_router(dedicated_router.router, prefix="/api/v1", tags=["Dedicated"])


register_exception_handlers(app)
