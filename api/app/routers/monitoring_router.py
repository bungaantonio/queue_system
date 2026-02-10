import logging
from fastapi import APIRouter, Request, Depends
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse, PlainTextResponse
from sqlalchemy.exc import SQLAlchemyError
from app.db.database import SessionLocal, get_db
from app.models.queue_item import QueueItem
from time import perf_counter

from app.schemas.time_response import TimerResponse, UserInfo
from app.services.queue_service import consult


logger = logging.getLogger(__name__)


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
            "message": (
                "Sistema operacional" if status == "ok" else "Problemas detectados"
            ),
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


@monitoring_router.get("/timer", response_model=TimerResponse)
def timer(db: Session = Depends(get_db)):
    """Retorna dados para alimentar Timer do frontend"""
    user_item = consult.get_served_user(db)  # status=BEING_SERVED
    if not user_item:
        return {
            "current_user": None,
            "sla_minutes": 0,
            "status": "Nenhum usuário ativo",
            "elapsed_seconds": 0,
        }

    now = datetime.now(timezone.utc)
    logger.info("Now (UTC-aware): %s, type: %s", now, type(now))

    # Garante que timestamp do usuário é UTC-aware
    user_ts = user_item.timestamp
    if user_ts.tzinfo is None:
        user_ts = user_ts.replace(tzinfo=timezone.utc)

    logger.info(
        "User item timestamp: %s, type: %s, tzinfo: %s",
        user_ts,
        type(user_ts),
        getattr(user_ts, "tzinfo", None),
    )

    elapsed = int((now - user_ts).total_seconds())
    logger.info("Elapsed seconds: %s", elapsed)

    sla_minutes = (
        int((user_item.sla_deadline - user_item.timestamp).total_seconds() // 60)
        if user_item.sla_deadline
        else 0
    )
    status = "Dentro do limite" if elapsed <= sla_minutes * 60 else "Ultrapassado"

    return TimerResponse(
        current_user=(
            UserInfo(id=user_item.id, name=user_item.name) if user_item else None
        ),
        sla_minutes=sla_minutes,
        elapsed_seconds=elapsed,
        status=status,
    )
