from datetime import datetime
from pydantic import BaseModel

from .user_schema import UserCreate
from .user_schema import UserBase, UserShortResponse, UserFullResponse
from .biometric_schema import BiometricBase, BiometricCreate


class QueueInsertRequest(BaseModel):
    user_id: int


class QueueBase(BaseModel):
    id: int
    position: int
    status: str
    timestamp: datetime | None = None

    class Config:
        from_attributes = True


class QueueListResponse(QueueBase):
    user: UserShortResponse


class QueueDetailResponse(QueueBase):
    user: UserFullResponse


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
    biometric: BiometricBase | None = None
    queue: QueueDetailResponse


class QueueNextResponse(BaseModel):
    message: str
    queue: QueueDetailResponse


class QueueDoneResponse(BaseModel):
    message: str
    queue: QueueDetailResponse


class RegisterRequest(BaseModel):
    user: UserCreate
    biometric: BiometricCreate
