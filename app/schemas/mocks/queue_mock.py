from datetime import datetime
from app.mocks.user_mock import mock_users


def manual_insert_mock(user_id: int):
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if not user:
        return {"status": "fail", "message": "User not found"}

    queue = {
        "id": 79,
        "status": "waiting",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    return {
        "status": "success",
        "message": "User added to the queue",
        "user": user,
        "queue": queue,
    }
