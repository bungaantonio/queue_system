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


# ------------------------------------------------------------------------------
# 🔧 Utilitário de serialização segura
# ------------------------------------------------------------------------------
def serialize_dates(obj):
    """Converte datetime/date em ISO 8601 recursivamente (para JSON)."""
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


# ------------------------------------------------------------------------------
# 🧠 Construção do estado da fila
# ------------------------------------------------------------------------------
def build_queue_state(db: Session) -> dict:
    """Constrói snapshot consistente do estado da fila."""
    try:
        current = consult.get_active_user(db)
    except QueueException as e:
        logger.debug(f"Nenhum usuário em atendimento ativo ({e}).")
        current = None
    except Exception as e:
        logger.exception(f"Erro inesperado ao obter item ativo: {e}")
        current = None

    try:
        called = consult.get_pending_verification_user(db)
    except QueueException as e:
        logger.debug(f"Nenhum usuário chamado pendente ({e}).")
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


# ------------------------------------------------------------------------------
# 🚀 Função principal de broadcast
# ------------------------------------------------------------------------------
async def broadcast_state():
    """
    Executa leitura pós-commit e publica estado da fila.
    Usa sessão própria e isolada (segura para BackgroundTasks).
    """
    start = time.perf_counter()
    session = SessionLocal()
    try:
        logger.debug("Iniciando broadcast_state() com sessão isolada.")
        serialized_state = build_queue_state(session)
        await queue_notifier.publish(serialized_state)
        elapsed = (time.perf_counter() - start) * 1000
        logger.debug(f"Broadcast concluído com sucesso ({elapsed:.1f} ms).")
    except Exception as e:
        logger.exception(f"Erro durante broadcast_state(): {e}")
    finally:
        session.close()
        logger.debug("Sessão SQLAlchemy encerrada após broadcast_state().")


# ------------------------------------------------------------------------------
# 🧱 Interface síncrona segura (para uso em endpoints)
# ------------------------------------------------------------------------------
def broadcast_state_sync():
    """
    Executa broadcast_state() de forma segura, mesmo fora de loop assíncrono.
    Ideal para uso com FastAPI BackgroundTasks.
    """
    try:
        try:
            # tenta usar loop atual (se existir)
            loop = asyncio.get_running_loop()
            loop.create_task(broadcast_state())
            logger.debug("Broadcast agendado no loop existente.")
        except RuntimeError:
            # se não há loop (ex: AnyIO worker), cria e executa um novo
            logger.debug("Nenhum loop ativo — criando novo event loop para broadcast.")
            asyncio.run(broadcast_state())
    except Exception as e:
        logger.exception(f"Erro no broadcast_state_sync(): {e}")