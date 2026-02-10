from typing import Optional, Dict
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


# ============================================================
# =============== DOMÍNIO DE TIPOS ==========================
# ============================================================

class CredentialType(str, Enum):
    ZKTECO = "zkteco"        # hardware
    WEBAUTHN = "webauthn"    # mobile / passkey


# ============================================================
# =============== INPUT MODELS ==============================
# ============================================================

class CredentialRegisterRequest(BaseModel):
    """
    Registro de nova credencial vinculada a um utilizador.
    Recebido diretamente do middleware (hash, UUID, etc).
    """
    credential: str = Field(
        ...,
        description="Identificador único do template capturado (hash, UUID, etc)."
    )
    cred_type: CredentialType = Field(
        default=CredentialType.ZKTECO,
        description="Tipo de credencial."
    )
    extra_data: Optional[Dict[str, str]] = Field(
        default=None,
        description="Metadados opcionais do dispositivo."
    )


class CredentialVerifyRequest(BaseModel):
    """
    Verificação de credencial durante atendimento, vinculado a um ‘item’ da fila.
    """
    queue_item_id: int
    credential: str  # hash / UUID do template
    cred_type: CredentialType = Field(default=CredentialType.ZKTECO)


class CredentialAuthRequest(BaseModel):
    """
    Autenticação formal com operador e ‘token’ de chamada.
    """
    queue_item_id: int
    credential: str
    operator_id: int
    call_token: str
    cred_type: CredentialType = Field(default=CredentialType.ZKTECO)


# ============================================================
# =============== OUTPUT MODELS =============================
# ============================================================

class CredentialVerifyResponse(BaseModel):
    """
    Resultado da verificação ou autenticação de credencial.
    """
    user_id: Optional[int] = None  # None se não encontrado
    credential_verified: bool
    message: str
    confidence: Optional[float] = Field(
        default=None,
        description="Nível de confiança retornado pelo middleware."
    )


class CredentialResponse(BaseModel):
    """
    Representação persistida de uma credencial.
    Não expõe o identificador diretamente por questões de segurança.
    """
    id: int
    user_id: int
    cred_type: CredentialType
    extra_data: Optional[Dict[str, str]] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ============================================================
# =============== EVENTOS EFÉMEROS =========================
# ============================================================

class CredentialScanEvent(BaseModel):
    """
    Evento efémero de leitura de credencial do middleware.
    Útil para fluxos descolados (scan antes da fila).
    """
    credential: str
    cred_type: CredentialType = Field(default=CredentialType.ZKTECO)
    metadata: Optional[Dict[str, str]] = None
    timestamp: datetime
