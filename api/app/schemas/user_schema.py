from datetime import date
import re
from pydantic import BaseModel, field_validator

BI_PATTERN = re.compile(r"^\d{9}[A-Z]{2}\d{3}$")


class UserCreate(BaseModel):
    name: str
    document_id: str
    phone: str | None = None
    birth_date: date | None = None


    @field_validator("document_id")
    @classmethod
    def validate_document_id(cls, value: str) -> str:
        normalized = value.strip().upper()
        if not BI_PATTERN.fullmatch(normalized):
            raise ValueError(
                "document_id inválido. Formato esperado: 9 dígitos + 2 letras da província + 3 dígitos (ex: 004578932BO049)."
            )
        return normalized

    class Config:
        from_attributes = True


class UserBase(UserCreate):
    id: int


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    birth_date: date | None = None


class UserOut(UserBase):
    id: int


class UserShortResponse(BaseModel):
    name: str
    id_hint: str | None = None


class UserFullResponse(BaseModel):
    id: int
    name: str
    id_number: str

    class Config:
        from_attributes = True
