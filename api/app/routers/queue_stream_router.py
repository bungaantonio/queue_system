# app/routers/queue_stream_router.py
import json
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
from app.db.database import SessionLocal
from app.helpers.queue_notifier import queue_notifier
from app.helpers.queue_broadcast import build_queue_state

router = APIRouter()


@router.get("/stream")
async def queue_stream(request: Request):
    q = await queue_notifier.subscribe()

    async def event_generator():
        # 1. Estado inicial
        with SessionLocal() as db:
            try:
                state_dict = build_queue_state(db)
                yield {
                    "event": "queue_sync",
                    "data": json.dumps(state_dict)
                }
            except Exception as e:
                yield {"event": "error", "data": str(e)}

        # 2. Loop de atualizações
        try:
            while not await request.is_disconnected():
                message = await q.get()
                # O broadcast_state já envia o dict vindo do model_dump
                yield {
                    "event": message["event"],
                    "data": json.dumps(message["data"])
                }
        finally:
            queue_notifier.unsubscribe(q)

    return EventSourceResponse(event_generator())
