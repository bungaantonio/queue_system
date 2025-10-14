# app/helpers/queue_broadcast.py

import asyncio
import logging
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.services import queue_service
from app.helpers.queue_notifier import queue_notifier
from app.exceptions.exceptions import QueueException

logger = logging.getLogger(__name__)


def serialize_dates(obj):
    """Converte recursivamente datetime/date em ISO strings dentro de dict/list."""
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


def build_queue_state(db: Session) -> dict:
    """Constrói o estado atual da fila (para SSE/JSON)."""
    try:
        current = queue_service.get_active_queue_item(db)
    except QueueException as e:
        logger.debug(f"Nenhum usuário em atendimento ativo ({e}).")
        current = None
    except Exception as e:
        logger.exception(f"Erro inesperado ao obter item ativo: {e}")
        current = None

    try:
        called = queue_service.get_pending_verification_item(db)
    except QueueException as e:
        logger.debug(f"Nenhum usuário chamado pendente ({e}).")
        called = None
    except Exception as e:
        logger.exception(f"Erro inesperado ao obter item pendente: {e}")
        called = None

    try:
        queue = queue_service.list_waiting_and_called_items(db) or []
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


async def broadcast_state(db: Session):
    """Publica o estado atual da fila em tempo real via SSE/WebSocket."""
    try:
        serialized_state = build_queue_state(db)
        await queue_notifier.publish(serialized_state)
        logger.debug("Estado da fila transmitido com sucesso.")
    except Exception as e:
        logger.exception(f"Erro ao transmitir estado da fila: {e}")


def broadcast_state_sync(db: Session):
    """Executa broadcast_state() de forma segura dentro de BackgroundTasks."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(broadcast_state(db))
            logger.debug("Broadcast assíncrono agendado (loop em execução).")
        else:
            asyncio.run(broadcast_state(db))
            logger.debug("Broadcast executado diretamente (novo loop).")
    except Exception as e:
        logger.exception(f"Erro no broadcast_state_sync: {e}")
