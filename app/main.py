from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.exceptions.handlers import register_exception_handlers
from app.routers import (
    queue_router,
    biometric_router,
    audit_router,
    queue_stream_router,
)

from app.db.base import Base
from app.db.database import engine

origins = [
    "http://localhost:5173",  # frontend em dev
    "http://127.0.0.1:5173",
    # depois pode adicionar o domínio real (ex: https://painel.fila.ao)
]
# , user_router


app = FastAPI(title="Sistema de Gestão de Filas")


# Apenas cria as tabelas se ainda não existirem
Base.metadata.create_all(bind=engine)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(queue_router.router, prefix="/queue", tags=["Queue"])
app.include_router(queue_stream_router.router, prefix="/sse", tags=["Queue Stream"])
# app.include_router(user_router.router, prefix="/users", tags=["Users"])
app.include_router(biometric_router.router, prefix="/biometrics", tags=["Biometrics"])
app.include_router(
    audit_router.router,
    prefix="/audit",
    tags=["Audit"],
    responses={404: {"description": "Registro não encontrado"}},
)


@app.get("/")
def root():
    return {"message": "Sistema de Gestão de Filas ativo"}


register_exception_handlers(app)
