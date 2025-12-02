from pydantic import BaseModel
from typing import Optional, Dict


class UserInfo(BaseModel):
    id: int
    name: str


class TimerResponse(BaseModel):
    current_user: Optional[UserInfo]
    sla_minutes: int
    elapsed_seconds: int
    status: str
