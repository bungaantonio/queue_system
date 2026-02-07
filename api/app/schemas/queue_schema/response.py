from pydantic import BaseModel
from datetime import datetime, date
from datetime import datetime, timezone
from typing import Optional
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
    in_queue: bool
    message: str
    position: Optional[int] = None
    status: Optional[str] = None
    timestamp: Optional[datetime] = None
    name: Optional[str] = None
    attendance_type: Optional[str] = None

    @classmethod
    def from_queue_item(cls, queue_item, msg="Usuário registrado na fila com sucesso"):
        if not queue_item:
            return cls(in_queue=False, message="Usuário não está na fila")

        name_parts = queue_item.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else queue_item.user.name
        )

        return cls(
            in_queue=True,
            message=msg,
            position=queue_item.position,
            status=queue_item.status,
            timestamp=queue_item.timestamp,
            name=short_name,
            attendance_type=queue_item.attendance_type,
        )


# --------------------------
# Público: detalhes do usuário (não sensível)
# --------------------------
class QueueDetailItem(BaseModel):
    id: int
    position: int
    status: str
    timestamp: datetime
    name: str
    document_id: Optional[str] = None
    id_hint: Optional[str] = None
    phone: Optional[str] = None
    birth_date: date
    attendance_type: Optional[str] = None
    sla_deadline: Optional[datetime] = None

    @classmethod
    def from_orm_item(cls, item):
        name_parts = item.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else item.user.name
        )
        document_id = item.user.id_number[-5:] if item.user.id_number else None
        phone_safe = f"****{item.user.phone[-4:]}" if item.user.phone else None

        return cls(
            id=item.id,
            position=item.position,
            status=item.status,
            timestamp=item.timestamp,
            name=short_name,
            document_id=document_id,
            id_hint=document_id,
            phone=phone_safe,
            birth_date=item.user.birth_date,
            attendance_type=item.attendance_type,
            sla_deadline=item.sla_deadline,
        )


# --------------------------
# Interno/Dev: chamado com call_token e hash
# --------------------------
class QueueCalledItem(QueueDetailItem):
    biometric_hash: str
    call_token: str

    @classmethod
    def from_orm_item(cls, item):
        name_parts = item.user.name.split(" ")
        short_name = (
            f"{name_parts[0]} {name_parts[-1][0]}."
            if len(name_parts) > 1
            else item.user.name
        )
        document_id = item.user.id_number[-5:] if item.user.id_number else None
        phone_safe = f"****{item.user.phone[-4:]}" if item.user.phone else None

        return cls(
            id=item.id,
            position=item.position,
            status=item.status,
            timestamp=item.timestamp,
            name=short_name,
            document_id=document_id,
            id_hint=document_id,
            phone=phone_safe,
            birth_date=item.user.birth_date,
            biometric_hash=item.biometric_hash,
            call_token=item.call_token,
        )
