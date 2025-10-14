# app/routers/queue_stream_router.py
import json
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse
from app.db.database import get_db
from app.helpers.queue_notifier import queue_notifier
from app.helpers.queue_broadcast import build_queue_state

router = APIRouter()

@router.get("/stream")
async def queue_stream(request: Request, db: Session = Depends(get_db)):
    q = await queue_notifier.subscribe()
    initial_state = build_queue_state(db)
    await q.put(initial_state)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                data = await q.get()
                yield {"data": json.dumps(data)}
        finally:
            queue_notifier.unsubscribe(q)

    return EventSourceResponse(event_generator())
