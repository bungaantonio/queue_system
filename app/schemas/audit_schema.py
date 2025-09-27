from pydantic import BaseModel
from datetime import datetime


class AuditBase(BaseModel):
    action: str
    details: str | None = None
    user_id: int | None = None
    queue_item_id: int | None = None
    biometric_id: int | None = None
    operator_id: int | None = None


class AuditResponse(AuditBase):
    id: int
    timestamp: datetime
    previous_hash: str | None
    record_hash: str

    class Config:
        from_attributes = True
