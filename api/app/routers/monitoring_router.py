from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy.exc import SQLAlchemyError
from app.db.database import SessionLocal
from app.models.queue_item import QueueItem
from time import perf_counter

monitoring_router = APIRouter()

@monitoring_router.get("/health", tags=["Monitoring"])
async def health():
    """Health check: banco de dados, fila e status geral"""
    db_status = "ok"
    queue_status = "ok"

    # Checagem banco de dados
    try:
        with SessionLocal() as db:
            db.execute("SELECT 1")
    except SQLAlchemyError:
        db_status = "fail"

    # Checagem tabela de filas
    try:
        with SessionLocal() as db:
            _ = db.query(QueueItem).count()
    except SQLAlchemyError:
        queue_status = "fail"

    status = "ok" if db_status == "ok" and queue_status == "ok" else "fail"

    return JSONResponse(
        content={
            "status": status,
            "database": db_status,
            "queue": queue_status,
            "message": "Sistema operacional" if status == "ok" else "Problemas detectados",
        }
    )

@monitoring_router.get("/metrics", tags=["Monitoring"])
async def metrics():
    """Endpoint pronto para Prometheus"""
    # Exemplo simples: latência dummy, contagem de filas
    try:
        with SessionLocal() as db:
            queue_count = db.query(QueueItem).count()
    except SQLAlchemyError:
        queue_count = 0

    # Formato Prometheus
    metrics_data = (
        f"# HELP queue_items_total Número de itens na fila\n"
        f"# TYPE queue_items_total gauge\n"
        f"queue_items_total {queue_count}\n"
    )
    return PlainTextResponse(content=metrics_data, media_type="text/plain")

def setup_monitoring_middleware(app):
    """Middleware global para medir tempo de resposta"""
    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = perf_counter()
        response = await call_next(request)
        process_time = perf_counter() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        return response
