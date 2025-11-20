from pydantic import BaseModel

class OperatorBase(BaseModel):
    username: str
    role: str

class OperatorCreate(OperatorBase):
    password: str

class OperatorOut(OperatorBase):
    id: int
    active: bool

    class Config:
        from_attributes = True
