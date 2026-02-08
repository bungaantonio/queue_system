from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from .user_schema import UserCreate, UserFullResponse
from .credential_schemas import CredentialCreate, CredentialBase

# ============================================================
# =============== QUEUE REQUEST MODELS ========================
# ============================================================

class QueueInsertRequest(BaseModel):
    """Requisição simples para inserir utilizador existente na fila."""
    user_id: int


class QueueRegisterRequest(BaseModel):
    """Registro completo: cria usuário e biometria, e insere na fila."""
    user: UserCreate
    credential: CredentialCreate


# ============================================================
# =============== BASE & COMMON MODELS ========================
# ============================================================

class QueueBase(BaseModel):
    """Modelo base compartilhado entre responses."""
    id: int
    position: int
    status: str
    timestamp: datetime | None = None

    model_config = {"from_attributes": True}


# ============================================================
# =============== QUEUE RESPONSE MODELS =======================
# ============================================================

# ---------- LISTAGEM / CONSULTA SIMPLES ----------
class QueueListResponse(QueueBase):
    """‘Item’ resumido para listas e atualizações em tempo real (SSE)."""
    name: str
    id_hint: Optional[str] = None


# ---------- DETALHE COMPLETO ----------
class QueueDetailResponse(QueueBase):
    """‘Item’ detalhado com dados do utilizador."""
    name: str
    id_number: Optional[str] = None
    phone: Optional[str] = None
    birth_date: Optional[datetime] = None


# ============================================================
# =============== ACTION RESPONSES (PADRONIZADOS) =============
# ============================================================

class QueueActionResponse(BaseModel):
    """Resposta genérica para ações sobre a fila."""
    message: str
    queue: QueueDetailResponse


class QueueCreateResponse(QueueActionResponse):
    """Resposta para criação de fila com novo registro de usuário."""
    status: str
    user: UserFullResponse
    credential: Optional[CredentialBase] = None


# Aliases semântico para legibilidade nos encaminhadores:
QueueNextResponse = QueueActionResponse
QueueDoneResponse = QueueActionResponse
QueueSkipResponse = QueueActionResponse


# ============================================================
# =============== CONSULTAS / VERIFICAÇÃO ====================
# ============================================================

class QueueConsultResponse(BaseModel):
    """Resposta para consulta por documento ou telefone."""
    in_queue: bool
    position: Optional[int] = None
    status: Optional[str] = None
    message: str


class QueueCalledOut(BaseModel):
    """Utilizador chamado para verificação biométrica."""
    queue_id: int
    user_id: int
    status: str


class QueueVerifyIn(BaseModel):
    """Entrada de verificação biométrica (scan)."""
    queue_id: int
    credential_id: str
