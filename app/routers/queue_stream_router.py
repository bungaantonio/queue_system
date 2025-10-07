import json
from sqlalchemy.orm import Session
from fastapi import APIRouter, Request, Depends
from app.db.database import get_db
from sse_starlette.sse import EventSourceResponse
from app.helpers.queue_notifier import queue_notifier

router = APIRouter()


@router.get("/stream")
async def queue_stream(request: Request, db: Session = Depends(get_db)):
    q = await queue_notifier.subscribe()

    # Envia o estado atual da fila imediatamente (em vez do dummy)
    from app.services.queue_service import get_current, get_called, list_waiting_queue
    from app.helpers.queue_broadcast import json_serializer
    import json

    current = get_current(db)
    called = get_called(db)
    queue = list_waiting_queue(db)

    state = {
        "current": current.dict() if current else None,
        "called": called.dict() if called else None,
        "queue": [u.dict() for u in queue],
    }

    await q.put(json.loads(json.dumps(state, default=json_serializer)))

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await q.get()
                print("🔔 Enviando SSE [QUEUE ROUTER]:", data)
                yield {"data": json.dumps(data)}
        finally:
            queue_notifier.unsubscribe(q)

    return EventSourceResponse(event_generator())