from datetime import date
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    document_id: str
    phone: str | None = None
    birth_date: date | None = None


class UserBase(UserCreate):
    id: int

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    birth_date: date | None = None


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserShortResponse(BaseModel):
    name: str
    id_hint: str | None = None


class UserFullResponse(BaseModel):
    id: int
    name: str
    id_number: str

    class Config:
        from_attributes = True
