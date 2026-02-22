from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class AuditVerificationDetail(BaseModel):
    id: int
    recalculated_hash: str
    stored_hash: str
    content_integrity: bool       # Se os dados do registro são autênticos
    previous_hash_matches: bool   # Se o elo com o anterior está íntegro
    valid: bool                   # Resultado final (AND)
    action: str
    operator_id: Optional[int]
    operator_username: Optional[str]
    user_id: Optional[int]
    user_name: Optional[str]
    queue_item_id: Optional[int]
    credential_id: Optional[int]
    details: Optional[dict] = Field(default_factory=dict)
    timestamp: datetime
    investigation_note: Optional[str] = None
    investigated_at: Optional[datetime] = None
    investigated_by_id: Optional[int] = None


class AuditChainSummary(BaseModel):
    all_valid: bool
    total_records: int
    valid_records: int
    invalid_records: int


class AuditChainValidationResult(BaseModel):
    all_valid: bool
    records: List[AuditVerificationDetail]
