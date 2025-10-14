# app/helpers/queue_broadcast.py
import asyncio
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.services import queue_service
from app.helpers.queue_helpers import map_to_queue_list, map_to_queue_detail
from app.helpers.queue_notifier import queue_notifier


def serialize_dates(obj):
    """
    Converte recursivamente datetime/date em ISO strings dentro de dict/list.
    """
    if isinstance(obj, dict):
        return {k: serialize_dates(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_dates(v) for v in obj]
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    return obj


def build_queue_state(db: Session) -> dict:
    """
    Constrói o estado da fila já pronto para SSE/JSON.
    """
    current = queue_service.get_current(db)
    called = queue_service.get_called(db)  
    queue = queue_service.list_waiting_queue(db) or []

    state = {"current": current, "called": called, "queue": queue}
    return serialize_dates(state)


async def broadcast_state(db: Session):
    """Publica o estado atual da fila em tempo real via SSE/WebSocket."""
    serialized_state = build_queue_state(db)
    await queue_notifier.publish(serialized_state)


def broadcast_state_sync(db: Session):
    """Wrapper síncrono para BackgroundTasks — executa broadcast_state."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            loop.create_task(broadcast_state(db))
        else:
            asyncio.run(broadcast_state(db))
    except RuntimeError:
        asyncio.run(broadcast_state(db))
