from sqlalchemy.orm import Session
from app.services import queue_service
from app.helpers.queue_notifier import queue_notifier
import json
from datetime import datetime


def json_serializer(obj):
    """
    Serializador customizado para tipos não compatíveis com JSON nativo.
    Atualmente converte datetime em string ISO 8601.
    """
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


async def broadcast_state(db: Session):
    """
    Envia o estado atual da fila para todos conectados ao SSE.
    Serializa corretamente datetimes e mantém a consistência da estrutura.
    """
    current = queue_service.get_current(db)
    called = queue_service.get_called(db)
    queue = queue_service.list_waiting_queue(db)

    state = {
        "current": current.dict() if current else None,
        "called": called.dict() if called else None,
        "queue": [u.dict() for u in queue],
    }

    # Serializa de forma segura antes de enviar
    serialized_state = json.loads(json.dumps(state, default=json_serializer))

    await queue_notifier.publish(serialized_state)
