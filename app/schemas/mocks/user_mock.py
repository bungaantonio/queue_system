from datetime import date

# Lista global simulando usuários registrados
mock_users = []


def register_user_mock():
    user = {
        "id": 123,
        "name": "João Manuel",
        "id_number": "0067186BO044",
        "phone": "923456789",
        "birth_date": "1995-04-12",
    }
    biometric = {
        "id": 55,
        "finger_index": 1,
        "template": "dummy-template",
        "hash": "sha256:a8f3c5...",
    }
    queue = {"id": 77, "status": "waiting", "created_at": "2025-09-23T15:11:00Z"}
    mock_users.append(user)
    return {
        "status": "success",
        "message": "User registered successfully",
        "user": user,
        "biometric": biometric,
        "queue": queue,
    }
