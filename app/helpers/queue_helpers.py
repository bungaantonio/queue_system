# app/helpers/queue_helpers.py
from app.models.queue_item import QueueItem


def map_to_queue_list(item: QueueItem) -> dict | None:
    """
    Versão resumida e segura para listagens/SSE.
    """
    if not item or not item.user:
        return None

    name_parts = item.user.name.split(" ")
    short_name = (
        f"{name_parts[0]} {name_parts[-1][0]}."
        if len(name_parts) > 1
        else item.user.name
    )
    id_hint = item.user.id_number[-5:] if item.user.id_number else None

    return {
        "id": item.id,
        "position": item.position,
        "status": item.status,
        "timestamp": item.timestamp,
        "name": short_name,
        "id_hint": id_hint,
    }


def map_to_queue_detail(item: QueueItem) -> dict | None:
    """
    Versão segura de detalhe para frontend.
    - Mantém dados úteis (nome completo, posição, status, timestamp).
    - Mascara dados sensíveis (id_number, phone, birth_date).
    """
    if not item or not item.user:
        return None

    name_parts = item.user.name.split(" ")
    short_name = (
        f"{name_parts[0]} {name_parts[-1][0]}."
        if len(name_parts) > 1
        else item.user.name
    )
    id_number = item.user.id_number[-5:] if item.user.id_number else None
    phone_safe = f"****{item.user.phone[-4:]}" if item.user.phone else None

    return {
        "id": item.id,
        "position": item.position,
        "status": item.status,
        "timestamp": item.timestamp,
        "name": short_name,
        "id_number": id_number,  # só últimos 5 dígitos
        "id_hint": id_number,  # só últimos 5 dígitos (compatibilidade)
        "phone": phone_safe,  # só últimos 4 dígitos
        "birth_date": item.user.birth_date,  # opcional: não expor
    }
