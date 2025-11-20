from pydantic import BaseModel
from datetime import datetime, timezone
from typing import Optional
from app.models.enums import QueueStatus, AttendanceType


class QuickQueueEntryBiometric(BaseModel):
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
