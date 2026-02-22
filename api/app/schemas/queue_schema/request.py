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
    cenario: str | None = Field(
        default=None,
        description="Cenário do fluxo (opcional). Quando ausente, usa PRODUCAO.",
        max_length=100,
    )


class QuickEntryRequest(BaseModel):
    """
    Representa a requisição para entrada rápida via credencial.
    """

    identifier: str = Field(
        ...,
        description="Identificador único da credencial capturada.",
    )
    cenario: str | None = Field(
        default=None,
        description="Cenário do fluxo (opcional). Quando ausente, usa PRODUCAO.",
        max_length=100,
    )


class QueueRequeue(BaseModel):
    user_id: int
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QueueCancel(BaseModel):
    item_id: int
