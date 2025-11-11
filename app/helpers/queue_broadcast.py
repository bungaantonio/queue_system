# app/helpers/queue_broadcast.py

import asyncio
import time
from datetime import datetime, date
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.helpers.logger import get_logger
from app.helpers.queue_notifier import queue_notifier
from app.services.queue_service import consult
from app.exceptions.exceptions import QueueException

logger = get_logger(__name__)


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
    state = {"current": None, "called": None, "queue": []}

    try:
        state["current"] = consult.get_active_user(db)
        current_user_id = getattr(state["current"], "id", None)
        logger.debug(
            "Usuário em atendimento ativo recuperado",
            extra={"extra_data": {"current_user_id": current_user_id}},
        )
    except QueueException as e:
        logger.debug(
            "Nenhum usuário em atendimento ativo",
            extra={"extra_data": {"exception": str(e)}},
        )
        state["current"] = None
    except Exception as e:
        logger.exception(
            "Erro inesperado ao obter item ativo",
            extra={"extra_data": {"exception": str(e)}},
        )
        state["current"] = None

    try:
        state["called"] = consult.get_pending_verification_user(db)
        called_user_id = getattr(state["called"], "id", None)
        logger.debug(
            "Usuário chamado pendente recuperado",
            extra={"extra_data": {"called_user_id": called_user_id}},
        )
    except QueueException as e:
        logger.debug(
            "Nenhum usuário chamado pendente",
            extra={"extra_data": {"exception": str(e)}},
        )
        state["called"] = None
    except Exception as e:
        logger.exception(
            "Erro inesperado ao obter item pendente",
            extra={"extra_data": {"exception": str(e)}},
        )
        state["called"] = None

    try:
        state["queue"] = consult.list_waiting_and_called_items(db) or []
        logger.debug(
            "Lista de itens da fila obtida",
            extra={"extra_data": {"queue_size": len(state["queue"])}},
        )
    except Exception as e:
        logger.exception(
            "Erro ao listar itens da fila",
            extra={"extra_data": {"exception": str(e)}},
        )
        state["queue"] = []

    return serialize_dates(state)


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
        logger.debug("Iniciando broadcast_state() com sessão isolada")

        serialized_state = build_queue_state(session)

        await queue_notifier.publish(serialized_state)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "Broadcast concluído com sucesso",
            extra={
                "extra_data": {
                    "elapsed_ms": elapsed_ms,
                    "queue_size": len(serialized_state.get("queue", [])),
                    "current_user_id": serialized_state.get("current", {}).get("id")
                    if isinstance(serialized_state.get("current"), dict)
                    else None,
                    "called_user_id": serialized_state.get("called", {}).get("id")
                    if isinstance(serialized_state.get("called"), dict)
                    else None,
                }
            },
        )
    except Exception as e:
        logger.exception(
            "Erro durante broadcast_state()",
            extra={"extra_data": {"exception": str(e)}},
        )
    finally:
        session.close()
        logger.debug("Sessão SQLAlchemy encerrada após broadcast_state()")


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
            loop = asyncio.get_running_loop()
            loop.create_task(broadcast_state())
            logger.debug("Broadcast agendado no loop existente")
        except RuntimeError:
            logger.debug("Nenhum loop ativo — criando novo event loop para broadcast")
            asyncio.run(broadcast_state())
    except Exception as e:
        logger.exception(
            "Erro no broadcast_state_sync()",
            extra={"extra_data": {"exception": str(e)}},
        )
