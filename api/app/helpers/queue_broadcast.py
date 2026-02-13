# app/helpers/queue_broadcast.py

import asyncio
import logging
import time
from datetime import datetime, date, timezone
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.helpers.queue_notifier import queue_notifier
from app.schemas.queue_schema.response import QueueStateSchema
from app.services.queue_service import consult

logger = logging.getLogger(__name__)


def serialize_dates(obj):
    """Converte datetime/date em ISO 8601 recursivamente (para JSON)."""
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


def build_queue_state(db: Session) -> dict:
    """
    Usa a camada Service para obter os dados e o Pydantic para transformar em JSON.
    """
    # Usando suas funções de service exatamente como você postou
    current_orm = consult.get_served_user(db)
    called_orm = consult.get_called_user(db)
    waiting_list_orm = consult.list_waiting_users(db)

    timer_state = build_timer_state(db)

    # Criamos o objeto de estado validando contra o Schema
    state = QueueStateSchema(
        current=current_orm,
        called=called_orm,
        queue=waiting_list_orm,
        timer=timer_state,
    )

    # model_dump(mode='json') converte automaticamente datetimes e enums
    return state.model_dump(mode="json")


def build_timer_state(db: Session):
    user_item = consult.get_served_user(db)
    if not user_item:
        return None

    now = datetime.now(timezone.utc)
    user_ts = user_item.timestamp

    if user_ts.tzinfo is None:
        user_ts = user_ts.replace(tzinfo=timezone.utc)

    elapsed = int((now - user_ts).total_seconds())

    sla_seconds = (
        int((user_item.sla_deadline - user_item.timestamp).total_seconds())
        if user_item.sla_deadline
        else 0
    )
    status = "Dentro do limite" if elapsed <= sla_seconds * 60 else "Ultrapassado"

    return {
        "started_at": user_ts,
        "sla_seconds": sla_seconds,
        "elapsed_seconds": elapsed,
        "status": status,
    }


async def broadcast_state():
    """Executa leitura pós-commit e publica estado da fila usando sessão isolada."""
    start = time.perf_counter()
    session = SessionLocal()
    try:
        state = build_queue_state(session)
        await queue_notifier.publish(state, event_name="queue_sync")
        elapsed = (time.perf_counter() - start) * 1000
        logger.info(f"Broadcast concluído com sucesso ({elapsed:.1f} ms).")
    except Exception as e:
        logger.exception(f"Erro durante broadcast_state(): {e}")
    finally:
        session.close()


def broadcast_state_sync():
    """
    Executa broadcast_state() de forma segura em BackgroundTasks.
    """
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_state())
    except RuntimeError:
        asyncio.run(broadcast_state())
