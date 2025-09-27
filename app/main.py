from fastapi import FastAPI
from app.exceptions.handlers import register_exception_handlers
from app.routers import queue_router, biometric_router, audit_router

# , user_router

from app.db.base import Base
from app.db.database import engine

# Apenas cria as tabelas se ainda não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sistema de Gestão de Filas")

app.include_router(queue_router.router, prefix="/queue", tags=["Queue"])
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
