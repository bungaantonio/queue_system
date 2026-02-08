# app/api/routers/credential_router.py
from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.orm import Session
import uuid, logging

from app.core.exceptions import AppException
from app.db.database import get_db
from app.helpers.queue_notifier import queue_notifier
from app.helpers.queue_broadcast import broadcast_state_sync
from app.helpers.response_helpers import success_response
from app.schemas.queue_schema.response import QueueDetailItem
from app.schemas.credential_schemas import CredentialAuthRequest
from app.services.credential_service import CredentialAuthService

logger = logging.getLogger(__name__)
router = APIRouter()

# Cache temporário para capturas de credencial (middleware)
temp_credential_cache: dict[str, str] = {}


@router.post("/authenticate", response_model=QueueDetailItem)
def authenticate_user(
        request: CredentialAuthRequest,
        db: Session = Depends(get_db),
        background_tasks: BackgroundTasks = None,
):
    """
    Endpoint para autenticar usuário chamado usando credential + call_token.

    Fluxo:
    1. Valida que o usuário está em CALLED_PENDING.
    2. Verifica se o call_token é válido e não expirou.
    3. Compara hash/identificador da credencial em tempo-constante.
    4. Se sucesso: marca credential_verified=True e promove para BEING_SERVED.
    """
    item = CredentialAuthService.authenticate_user(
        db=db,
        queue_item_id=request.queue_item_id,
        presented_identifier=request.identifier,
        presented_call_token=request.call_token,
        operator_id=request.operator_id,
    )

    if background_tasks:
        background_tasks.add_task(broadcast_state_sync)

    return success_response(QueueDetailItem.from_orm_item(item))


@router.post("/request-capture/{operator_id}")
async def request_capture(operator_id: int):
    """Acionado pelo frontend para gerar token temporário de captura de credencial."""
    session_id = str(uuid.uuid4())
    await queue_notifier.publish(
        event_name="command_capture",
        data={"operator_id": operator_id, "temp_session_id": session_id},
    )
    return success_response({"session_id": session_id})


@router.post("/register-capture")
async def receive_capture(payload: dict):
    """Recebe a credencial capturada pelo middleware e armazena temporariamente."""
    s_id = payload.get("session_id")
    c_id = payload.get("credential_id")

    if s_id and c_id:
        temp_credential_cache[s_id] = c_id
        logger.debug(f"Credencial temporária gravada: {s_id} -> {c_id}")
        return success_response({"status": "ok"})
    return success_response({"status": "error"})


@router.get("/fetch-identifier/{session_id}")
async def fetch_identifier(session_id: str):
    """O frontend chama este endpoint para obter o identificador temporário da credencial."""
    c_id = temp_credential_cache.get(session_id)
    if not c_id:
        logger.warning(f"Tentativa de busca falhou para sessão {session_id}")
        raise AppException("credential.not_found")

    return success_response({"identifier": c_id})
