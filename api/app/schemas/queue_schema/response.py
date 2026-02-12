from pydantic import BaseModel, ConfigDict, computed_field
from datetime import date
from datetime import datetime, timezone
from typing import Optional, List
from app.models.enums import QueueStatus, AttendanceType


# --------------------------
# Público: listagens de fila
# --------------------------
class QueueListItem(BaseModel):
    id: int
    position: int
    status: str
    timestamp: datetime
    name: str
    id_hint: Optional[str]
    attendance_type: Optional[str] = None

    @classmethod
    def from_orm_item(cls, item):
        name_parts = item.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else item.user.name
        )
        id_hint = item.user.id_number[-5:] if item.user.id_number else None
        return cls(
            id=item.id,
            position=item.position,
            status=item.status,
            timestamp=item.timestamp,
            name=short_name,
            id_hint=id_hint,
            attendance_type=item.attendance_type,
        )


class QuickEntryResponse(BaseModel):
    """
    Representa um usuário que entrou rapidamente na fila.
    """

    id: int
    user_id: int
    status: QueueStatus
    attendance_type: AttendanceType
    entered_at: datetime
    updated_at: datetime
    position: Optional[int] = None

    @classmethod
    def from_orm_item(cls, item):
        """
        Constrói o schema a partir do objeto ORM, refletindo a entrada rápida.
        """
        return cls(
            id=item.id,
            user_id=item.user_id,
            status=item.status,
            attendance_type=getattr(item, "attendance_type", AttendanceType.NORMAL),
            entered_at=datetime.now(timezone.utc),
            updated_at=getattr(item, "updated_at", datetime.now(timezone.utc)),
            position=getattr(item, "position", None),
        )


class QueueConsult(BaseModel):
    id: int
    in_queue: bool
    message: str
    position: Optional[int] = None
    status: Optional[str] = None
    timestamp: Optional[datetime] = None
    name: Optional[str] = None
    attendance_type: Optional[str] = None

    @classmethod
    def from_orm_item(cls, queue_item, msg="Usuário registado na fila com sucesso"):
        if not queue_item:
            return cls(in_queue=False, message="Usuário não está na fila")

        name_parts = queue_item.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else queue_item.user.name
        )

        return cls(
            id=queue_item.id,
            in_queue=True,
            message=msg,
            position=queue_item.position,
            status=queue_item.status,
            timestamp=queue_item.timestamp,
            name=short_name,
            attendance_type=queue_item.attendance_type,
        )


class QueueDetailItem(BaseModel):
    id: int
    user_id: int  # Identificador numérico do utilizador
    position: int
    status: str
    timestamp: datetime
    name: str  # Nome formatado (ex: Bunga A.)
    document_id: Optional[str] = None
    id_hint: Optional[str] = None
    phone: Optional[str] = None
    birth_date: date
    attendance_type: Optional[str] = None
    sla_deadline: Optional[datetime] = None

    @classmethod
    def from_orm_item(cls, item):
        name_parts = item.user.name.split(" ")
        short_name = f"{name_parts[0]} {name_parts[-1][0]}." if len(name_parts) > 1 else item.user.name
        doc_hint = item.user.id_number[-5:] if item.user.id_number else None

        return cls(
            id=item.id,
            user_id=item.user.id,  # <--- Importante
            position=item.position,
            status=item.status,
            timestamp=item.timestamp,
            name=short_name,
            document_id=doc_hint,
            id_hint=doc_hint,
            phone=item.user.phone,
            birth_date=item.user.birth_date,
            attendance_type=item.attendance_type,
            sla_deadline=item.sla_deadline,
        )


class QueueCalledItem(QueueDetailItem):
    # Campos extras para quando o utilizador é chamado
    credential: Optional[str] = None
    credential_verified: bool = False
    call_token: Optional[str] = None
    call_token_expires_at: Optional[datetime] = None
    attempted_verification: bool = False

    @classmethod
    def from_orm_item(cls, item):
        # Primeiro pegamos os dados base da classe pai
        base_data = QueueDetailItem.from_orm_item(item).dict()

        # Adicionamos os campos específicos desta classe
        base_data.update({
            "credential": item.credential,
            "credential_verified": item.credential_verified,
            "call_token": item.call_token,
            "call_token_expires_at": item.call_token_expires_at,
            "attempted_verification": item.attempted_verification,
        })
        return cls(**base_data)

class UserSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    id_number: Optional[str] = None  # necessário para calcular document_id


class QueueItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: str
    position: int
    attendance_type: Optional[str] = None
    timestamp: Optional[datetime] = None
    user: Optional[UserSchema] = None

    @computed_field
    @property
    def short_name(self) -> Optional[str]:
        if not self.user or not self.user.name:
            return None
        name_parts = self.user.name.split(" ")
        return (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else self.user.name
        )

    @computed_field
    @property
    def ticket(self) -> Optional[str]:
        if not self.user or not self.user.id_number:
            return None
        return self.user.id_number[-5:]


class QueueStateSchema(BaseModel):
    current: Optional[QueueItemSchema] = None
    called: Optional[QueueItemSchema] = None
    queue: List[QueueItemSchema] = []
