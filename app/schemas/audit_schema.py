from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional


class AuditBase(BaseModel):
    action: str = Field(..., description="Tipo de ação realizada", example="CREATE")
    details: Optional[str] = Field(None, description="Detalhes adicionais da ação", example="Criação de item na fila")
    user_id: Optional[int] = Field(None, description="ID do usuário que realizou a ação", example=42)
    queue_item_id: Optional[int] = Field(None, description="ID do item da fila relacionado à ação", example=101)
    biometric_id: Optional[int] = Field(None, description="ID biométrico associado à ação", example=7)
    operator_id: Optional[int] = Field(None, description="ID do operador responsável pela ação", example=3)


class AuditResponse(AuditBase):
    id: int = Field(..., description="ID único do registro de auditoria", example=1)
    timestamp: datetime = Field(..., description="Data e hora do registro de auditoria", example="2025-09-27T20:00:00")
    previous_hash: Optional[str] = Field(None, description="Hash do registro anterior na cadeia", example="abc123...")
    record_hash: str = Field(..., description="Hash atual do registro", example="f55abdd8040571816f310692ff64db0fab47d2cc309fac8a0644def00546f3c2")

    class Config:
        from_attributes = True


class AuditVerificationDetail(BaseModel):
    audit_id: int = Field(..., description="ID do registro auditado", example=1)
    recalculated_hash: str = Field(..., description="Hash recalculado do registro", example="f55abdd8040571816f310692ff64db0fab47d2cc309fac8a0644def00546f3c2")
    stored_hash: str = Field(..., description="Hash armazenado no banco", example="f55abdd8040571816f310692ff64db0fab47d2cc309fac8a0644def00546f3c2")
    previous_hash_matches: bool = Field(..., description="Se o hash anterior confere com o registro anterior", example=True)
    valid: bool = Field(..., description="Indica se o registro é válido", example=True)


class AuditChainValidationResult(BaseModel):
    all_valid: bool = Field(..., description="Se todos os registros são válidos", example=True)
    records: List[AuditVerificationDetail] = Field(..., description="Lista com detalhes da verificação de cada registro")


class AuditChainSummary(BaseModel):
    all_valid: bool = Field(..., description="Se todos os registros da cadeia são válidos", example=True)
    total_records: int = Field(..., description="Número total de registros na cadeia", example=10)
    valid_records: int = Field(..., description="Número de registros válidos", example=10)
    invalid_records: int = Field(..., description="Número de registros inválidos", example=0)
