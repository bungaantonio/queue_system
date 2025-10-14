from app.mocks.user_mock import mock_users


def verify_biometric_mock(user_id: int):
    user = next((u for u in mock_users if u["id"] == user_id), None)
    if not user:
        return {"status": "fail", "message": "User not found or invalid biometric"}

    queue = {"id": 78, "status": "waiting", "created_at": "2025-09-23T16:02:00Z"}
    return {
        "status": "success",
        "message": "Biometric verified",
        "user": user,
        "queue": queue,
    }
