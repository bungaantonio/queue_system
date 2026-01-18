# app/schemas/queue_schema.py
from pydantic import BaseModel

from app.models.enums import AttendanceType
from app.schemas.user_schema import UserCreate


class BiometricCreate(BaseModel):
    biometric_id: str


class QueueRegister(BaseModel):
    user: UserCreate
    biometric: BiometricCreate
    operator_id: int
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QueueRequeue(BaseModel):
    user_id: int
    attendance_type: AttendanceType = AttendanceType.NORMAL


class QueueCancel(BaseModel):
    item_id: int
