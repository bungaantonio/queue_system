from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .user_schema import UserCreate, UserBase, UserFullResponse
from .biometric_schema import BiometricBase, BiometricCreate

# ------------------ REQUESTS ------------------
class QueueInsertRequest(BaseModel):
    user_id: int

class RegisterRequest(BaseModel):
    user: UserCreate
    biometric: BiometricCreate

# ------------------ BASE QUEUE ------------------
class QueueBase(BaseModel):
    id: int
    position: int
    status: str
    timestamp: datetime | None = None

    model_config = {"from_attributes": True}

# ------------------ RESPONSE SCHEMAS ------------------

# Lista resumida de fila (para list_waiting_queue / SSE)
class QueueListResponse(QueueBase):
    name: str
    id_hint: Optional[str] = None

# Detalhe completo de fila (para endpoints que retornam item específico)
class QueueDetailResponse(QueueBase):
    name: str
    id_number: Optional[str] = None
    phone: Optional[str] = None
    birth_date: Optional[datetime] = None

# Skip, Create, Next, Done
class QueueSkipResponse(BaseModel):
    message: str
    old_id: int
    new_id: int
    position: int
    status: str

class QueueCreateResponse(BaseModel):
    status: str
    message: str
    user: UserFullResponse
    biometric: Optional[BiometricBase] = None
    queue: QueueDetailResponse

class QueueNextResponse(BaseModel):
    message: str
    queue: QueueDetailResponse

class QueueDoneResponse(BaseModel):
    message: str
    queue: QueueDetailResponse

# Consult / Verify
class QueueConsultResponse(BaseModel):
    in_queue: bool
    position: Optional[int] = None
    status: Optional[str] = None
    message: str

class QueueCalledOut(BaseModel):
    queue_id: int
    user_id: int
    status: str

class QueueVerifyIn(BaseModel):
    queue_id: int
    biometric_id: str
