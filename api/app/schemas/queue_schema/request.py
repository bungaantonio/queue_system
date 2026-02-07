# app/schemas/queue_schema.py
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional
from app.models.enums import QueueStatus, AttendanceType
from app.models.enums import AttendanceType
from app.schemas.user_schema import UserCreate


class BiometricCreate(BaseModel):
    biometric_hash: str


class QueueRegister(BaseModel):
    user: UserCreate
    biometric: BiometricCreate
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QuickEntryRequest(BaseModel):
    """
    Representa a requisição para leitura de uma biometria.
    """

    biometric_hash: str = Field(
        ...,
        description="Identificador único do template biométrico capturado (hash, UUID, etc).",
    )
    attendance_type: AttendanceType = Field(
        ...,
        description="Tipo de atendimento (NORMAL, PRIORITY, URGENT).",
    )


class QueueRequeue(BaseModel):
    user_id: int
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QueueCancel(BaseModel):
    item_id: int
