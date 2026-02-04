# app/helpers/queue_broadcast.py

import asyncio
import logging
import time
from datetime import datetime, date
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.helpers.queue_notifier import queue_notifier
from app.services.queue_service import consult
from app.exceptions.exceptions import QueueException

logger = logging.getLogger(__name__)


# --------------------------------------------------------------------------
# 🔧 Serialização segura de datas
# --------------------------------------------------------------------------
def serialize_dates(obj):
    """Converte datetime/date em ISO 8601 recursivamente (para JSON)."""
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


# --------------------------------------------------------------------------
# 🧠 Construção do estado da fila
# --------------------------------------------------------------------------
def build_queue_state(db: Session) -> dict:
    """Constrói snapshot consistente do estado da fila."""
    try:
        current = consult.get_active_user(db)
    except QueueException:
        current = None
    except Exception as e:
        logger.exception(f"Erro inesperado ao obter item ativo: {e}")
        current = None

    try:
        called = consult.get_pending_verification_user(db)
    except QueueException:
        called = None
    except Exception as e:
        logger.exception(f"Erro inesperado ao obter item pendente: {e}")
        called = None

    try:
        queue = consult.list_waiting_and_called_items(db) or []
    except Exception as e:
        logger.exception(f"Erro ao listar itens da fila: {e}")
        queue = []

    return serialize_dates(
        {
            "current": current,
            "called": called,
            "queue": queue,
        }
    )


# --------------------------------------------------------------------------
# 🚀 Função principal de broadcast
# --------------------------------------------------------------------------
async def broadcast_state():
    """Executa leitura pós-commit e publica estado da fila usando sessão isolada."""
    start = time.perf_counter()
    session = SessionLocal()
    try:
        state = build_queue_state(session)
        # Especificamos o nome do evento que o C# espera para a fila
        await queue_notifier.publish(state, event_name="queue_sync")
        elapsed = (time.perf_counter() - start) * 1000
        logger.info(f"Broadcast concluído com sucesso ({elapsed:.1f} ms).")
    except Exception as e:
        logger.exception(f"Erro durante broadcast_state(): {e}")
    finally:
        session.close()


# --------------------------------------------------------------------------
# 🧱 Interface síncrona segura (para endpoints FastAPI)
# --------------------------------------------------------------------------
def broadcast_state_sync():
    """
    Executa broadcast_state() de forma segura em BackgroundTasks.
    Compatível com loop assíncrono existente ou cria loop temporário se necessário.
    """
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_state())
    except RuntimeError:
        # raro: cria loop temporário para execução imediata
        asyncio.run(broadcast_state())
