from pydantic import BaseModel
from typing import Optional

from app.models.enums import OperatorRole


class OperatorBase(BaseModel):
    username: str
    role: OperatorRole


class OperatorCreate(OperatorBase):
    password: str


class OperatorUpdate(BaseModel):
    role: Optional[str] = None
    password: Optional[str] = None


class OperatorOut(OperatorBase):
    id: int
    active: bool

    class Config:
        from_attributes = True
