from pydantic import BaseModel
from typing import Optional, Dict


class UserInfo(BaseModel):
    id: int
    name: str


class TimerSchema(BaseModel):
    #current_user: Optional[UserInfo]
    sla_seconds: int
    elapsed_seconds: int
    status: str
