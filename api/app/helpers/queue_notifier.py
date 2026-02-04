# app/helpers/queue_notifier.py
import asyncio
from typing import Any


class QueueNotifier:
    def __init__(self):
        self.subscribers: list[asyncio.Queue] = []

    async def subscribe(self) -> asyncio.Queue:
        q = asyncio.Queue()
        self.subscribers.append(q)
        return q

    def unsubscribe(self, q: asyncio.Queue):
        if q in self.subscribers:
            self.subscribers.remove(q)

    async def publish(self, data: Any, event_name: str = "queue_sync"):
        """
        Agora aceita um event_name.
        O padrão é "queue_sync" para manter compatibilidade com a fila.
        """
        message = {"event": event_name, "data": data}
        for q in list(self.subscribers):
            await q.put(message)


queue_notifier = QueueNotifier()
