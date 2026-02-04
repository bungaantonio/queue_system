# app/routers/biometric_router.py
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session
import uuid, logging
from app.db.database import get_db
from app.helpers.queue_notifier import queue_notifier
from app.helpers.queue_broadcast import broadcast_state_sync
from app.schemas.queue_schema.response import QueueDetailItem
from app.services.biometric_service import scan
from app.schemas.biometric_schema.response import QuickQueueEntryBiometric
from app.schemas.biometric_schema.request import (
    BiometricScan,
    BiometricAuthRequest,
)
from app.exceptions.exceptions import QueueException
from app.services.biometric_service.authentication import BiometricAuthService
from app.utils.helpers import resolve_operator_id

logger = logging.getLogger(__name__)
router = APIRouter()

# Cache temporário para o cadastro
temp_biometric_cache = {}


@router.post("/quick-entry", response_model=QuickQueueEntryBiometric)
def entry(
    request: BiometricScan,
    db: Session = Depends(get_db),
    operator_id: int = Depends(resolve_operator_id),
    background_tasks: BackgroundTasks = None,
):
    """
    Entrada rápida na fila.

    - Se feita por operador logado → usa ID do operador
    - Se feita pelo usuário final → usa operador padrão do sistema
    """

    result = scan.quick_entry(
        db, request, request.biometric_id, operator_id=operator_id
    )

    db.commit()

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return result


@router.post("/authenticate", response_model=QueueDetailItem)
def authenticate_user(
    request: BiometricAuthRequest,
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
            queue_item_id=request.queue_item_id,
            presented_biometric_hash=request.biometric_hash,
            presented_call_token=request.call_token,
            operator_id=request.operator_id,
        )
    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return QueueDetailItem.from_orm_item(item)


@router.post("/request-capture/{operator_id}")
async def request_capture(operator_id: int):
    """Acionado pelo React Admin"""
    session_id = str(uuid.uuid4())

    # Enviamos o comando específico que o C# está ouvindo
    await queue_notifier.publish(
        event_name="command_capture",
        data={"operator_id": operator_id, "temp_session_id": session_id},
    )
    return {"session_id": session_id}


@router.post("/register-capture")
async def receive_capture(payload: dict):
    s_id = payload.get("session_id")
    b_id = payload.get("biometric_id")
    
    if s_id and b_id:
        temp_biometric_cache[s_id] = b_id # Grava no dicionário global
        print(f"DEBUG: Gravado {s_id}")
        return {"status": "ok"}
    return {"status": "error"}


@router.get("/fetch-hash/{session_id}")
async def fetch_hash(session_id: str):
    """O React chama este endpoint para pegar a digital"""
    b_id = temp_biometric_cache.get(session_id)
    if not b_id:
        logger.warning(f"Tentativa de busca falhou para sessão {session_id}")
        raise HTTPException(status_code=404, detail="Não capturado")

    return {"biometric_id": b_id}
