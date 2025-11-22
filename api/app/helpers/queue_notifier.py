import asyncio

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

    async def publish(self, event: dict):
        for q in list(self.subscribers):
            await q.put(event)

# instância global
queue_notifier = QueueNotifier()
