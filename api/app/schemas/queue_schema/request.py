# app/schemas/queue_schema.py
from pydantic import BaseModel, Field
from app.models.enums import AttendanceType
from app.schemas.user_schema import UserCreate


class CredentialRegister(BaseModel):
    identifier: str = Field(
        ...,
        description="Identificador único da credencial capturada (hash, UUID, public key, etc).",
    )


class QueueRegister(BaseModel):
    user: UserCreate
    credential: CredentialRegister
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QuickEntryRequest(BaseModel):
    """
    Representa a requisição para entrada rápida via credencial.
    """

    identifier: str = Field(
        ...,
        description="Identificador único da credencial capturada.",
    )


class QueueRequeue(BaseModel):
    user_id: int
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QueueCancel(BaseModel):
    item_id: int
