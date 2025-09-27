from app.exceptions.exceptions import QueueException
from app.models.queue_item import QueueItem
from app.schemas.queue_schema import QueueListResponse, RegisterRequest
from app.schemas.user_schema import UserShortResponse


def build_models(request: RegisterRequest):
    if not request:
        raise QueueException("queue_missing_request_body")

    if not request.biometric.biometric_id:
        raise QueueException("queue_missing_biometric_id")

    return request.user, request.biometric


def format_queue_item(item: QueueItem) -> QueueListResponse:
    user = item.user
    name_parts = user.name.split(" ")

    short_name = (
        name_parts[0] + " " + name_parts[-1][0] + "."
        if len(name_parts) > 1
        else user.name
    )
    id_hint = user.id_number[-5:] if user.id_number else None

    return QueueListResponse(
        id=item.id,
        position=item.position,
        status=item.status,
        timestamp=item.timestamp,
        user=UserShortResponse(name=short_name, id_hint=id_hint),
    )
