from pydantic import BaseModel, Field
from typing import Optional, Annotated
from datetime import datetime


# ----------------- Request -----------------
class OperatorCreateRequest(BaseModel):
    username: Annotated[str, Field(min_length=3, max_length=64)]
    password: Annotated[str, Field(min_length=3)]
    role: str


class OperatorUpdateRequest(BaseModel):
    username: Optional[Annotated[str, Field(min_length=3, max_length=64)]] = None
    password: Optional[Annotated[str, Field(min_length=6)]] = None
    role: Optional[str] = None


# ----------------- Response -----------------
class OperatorResponse(BaseModel):
    id: int
    username: str
    role: str
    active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    last_activity: Optional[datetime] = None

    class Config:
        from_attributes = True
