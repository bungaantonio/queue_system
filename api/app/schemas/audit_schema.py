from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class AuditVerificationDetail(BaseModel):
    id: int = Field(..., description="ID do registro auditado")
    recalculated_hash: str = Field(..., description="Hash recalculado do registro")
    stored_hash: str = Field(..., description="Hash armazenado no banco")
    previous_hash_matches: bool = Field(..., description="Se o hash anterior confere")
    valid: bool = Field(..., description="Se o registro é válido")
    action: str
    operator_id: Optional[int]
    user_id: Optional[int]
    queue_item_id: Optional[int]
    biometric_id: Optional[int]
    details: Optional[dict] = Field(default_factory=dict)
    timestamp: datetime


class AuditChainSummary(BaseModel):
    all_valid: bool
    total_records: int
    valid_records: int
    invalid_records: int


class AuditChainValidationResult(BaseModel):
    all_valid: bool
    records: List[AuditVerificationDetail]
