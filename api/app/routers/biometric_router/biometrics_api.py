# app/routers/biometric_router.py
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.helpers.queue_broadcast import broadcast_state_sync
from app.schemas.queue_schema.response import QueueDetailItem
from app.services.biometric_service import scan
from app.schemas.biometric_schema.response import QuickQueueEntryBiometric
from app.schemas.biometric_schema.request import (
    BiometricVerify,
    BiometricScan,
    BiometricAuth,
)
from app.exceptions.exceptions import QueueException
from app.services.biometric_service.authentication import BiometricAuthService

router = APIRouter()


@router.post("/quick-entry", response_model=QuickQueueEntryBiometric)
def entry(
    request: BiometricScan,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Processa leitura biométrica rápida:
    - Identifica o usuário com base no template biométrico.
    - Marca verificação (biometric_verified=True, se aplicável).
    - Retorna o estado atualizado da fila.
    """
    result = scan.quick_entry(db, request, request.biometric_id)

    db.commit()

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result


@router.post("/authenticate", response_model=QueueDetailItem)
def authenticate_user(
    request: BiometricAuth,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """
    Endpoint para autenticar usuário chamado usando biometria + call_token.

    Fluxo:
    1. Valida que o usuário está em CALLED_PENDING.
    2. Verifica se o call_token é válido e não expirou.
    3. Compara hash biométrico (HMAC) em tempo-constante.
    4. Se sucesso: marca biometric_verified=True e promove para BEING_SERVED.
    """
    with db.begin():  # Transação atômica: commit/rollback automático
        item = BiometricAuthService.authenticate_user(
            db=db,
            user_id=request.user_id,
            presented_biometric_hash=request.biometric_hash,
            presented_call_token=request.call_token,
            operator_id=request.operator_id,
        )
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return QueueDetailItem.from_orm_item(item)


@router.post("/verify_called_user", response_model=QuickQueueEntryBiometric)
def verify_called_user(
    request: BiometricVerify,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    result = scan.verify_called_user(
        db,
        request.queue_id,
        request.biometric_id,
    )

    # agenda o broadcast depois da alteração de estado
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result
