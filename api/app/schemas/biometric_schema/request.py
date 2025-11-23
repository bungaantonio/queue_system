from typing import Optional
from pydantic import BaseModel, Field

from app.models.enums import AttendanceType


class BiometricVerify(BaseModel):
    pass


class BiometricScan(BaseModel):
    """
    Representa a requisição para leitura de uma biometria.
    """

    biometric_id: str = Field(
        ...,
        description="Identificador único do template biométrico capturado (hash, UUID, etc).",
    )
    attendance_type: AttendanceType = Field(
        ...,
        description="Tipo de atendimento (NORMAL, PRIORITY, URGENT).",
    )


class BiometricAuth(BaseModel):
    queue_item_id: int
    biometric_hash: str
    call_token: str
    operator_id: int
