from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.db.base import Base
from app.db.database import engine
from app.db.seed_system_operator import bootstrap_system_operators

from app.routers import (
    auth_router,
    dedicated_router,
    operators_router,
    audit_router,
    queue_stream_router,
)
from app.routers.queue_router import queue_api
from app.routers.monitoring_router import monitoring_router, setup_monitoring_middleware
from app.api.routers import credential_routers, utentes

from app.core.exception_handlers import register_exception_handlers

import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

origins = [
    "http://localhost:3101",
    "http://localhost:3102",
    "http://192.168.18.6:3101",
    "http://192.168.18.6:3102",

    # depois pode adicionar o domínio real (ex: https://painel.fila.ao)
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 🔹 Startup: garante que SYSTEM e DEFAULT ADMIN existem
    bootstrap_system_operators()
    yield
    # 🔹 Shutdown: nenhuma ação adicional necessária


app = FastAPI(title="Sistema de Gestão de Filas", lifespan=lifespan)

# Criação das tabelas
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware global
setup_monitoring_middleware(app)

# Rotas
app.include_router(monitoring_router, prefix="/api/v1/monitoring")
app.include_router(queue_api.router, prefix="/api/v1/queue", tags=["Queue"])
app.include_router(queue_stream_router.router, prefix="/api/v1/sse", tags=["Queue Stream"])
# app.include_router(user_router.router, prefix="/users", tags=["Users"])
app.include_router(credential_routers.router, prefix="/api/v1/credential", tags=["Credências"])
app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(operators_router.router, prefix="/api/v1/operators", tags=["Operadores"])
app.include_router(audit_router.router, prefix="/api/v1/audits", tags=["Audits"])
app.include_router(utentes.router, prefix="/api/v1", tags=["Utentes"])
app.include_router(dedicated_router.router, prefix="/api/v1", tags=["Ticket"])

register_exception_handlers(app)


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
