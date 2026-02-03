# app/services/queue_service/quick_entry.py
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.user.read import get_user
from app.crud.queue.create import enqueue_user
from app.crud.queue.read import get_existing_queue_item
from app.models.user_credential import UserCredential
from app.schemas.biometric_schema.response import QuickQueueEntryBiometric
from app.exceptions.exceptions import BiometricException, QueueException
from app.services.biometric_service.utils import hash_identifier


def quick_entry(
    db: Session, request, biometric_id: str, operator_id: Optional[int] = None
) -> QuickQueueEntryBiometric:

    # 1. Aplica hash ao ID da biometria
    hashed_id = hash_identifier(biometric_id)

    # 2. Busca usuário pelo hash
    cred = (
        db.query(UserCredential).filter(UserCredential.identifier == hashed_id).first()
    )
    if not cred:
        raise BiometricException("biometric_not_found")

    user = get_user(db, cred.user_id)
    if not user:
        raise QueueException("user_not_found")

    # 3. Verifica se o usuário já está na fila
    queue_item = get_existing_queue_item(db, user.id)
    if queue_item:
        # Retorna o item existente (idempotente)
        return QuickQueueEntryBiometric.from_orm_item(queue_item)

    # 4. Se não estiver na fila, adiciona
    queue_item = enqueue_user(
        db,
        user=user,
        operator_id=operator_id or 1,  # ID padrão do sistema/totem
        attendance_type=request.attendance_type,
    )

    return QuickQueueEntryBiometric.from_orm_item(queue_item)
