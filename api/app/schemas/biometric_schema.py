from pydantic import BaseModel
from typing import Optional, Dict


class BiometricCreate(BaseModel):
    biometric_id: str
    finger_index: int


class BiometricVerifyRequest(BaseModel):
    queue_id: int
    biometric_id: str  # sempre vem do middleware


class BiometricVerifyResponse(BaseModel):
    user_id: int
    verified: bool
    message: str
    score: Optional[float] = None  # opcional: nível de confiança do middleware


class BiometricBase(BiometricCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class BiometricScanRequest(BaseModel):
    biometric_id: str
    metadata: Optional[Dict[str, str]] = None
