from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Index,
    CheckConstraint, Text,
)
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import relationship, validates
from app.db.base import Base
from app.models.enums import QueueStatus, AttendanceType


class QueueItem(Base):
    __tablename__ = "queue_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    status = Column(String(32), nullable=False, default=QueueStatus.WAITING)
    position = Column(Integer, nullable=False)
    timestamp = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )

    # --- Campos adicionais ---
    priority_score = Column(Integer, default=0, nullable=False)
    priority_reason = Column(String(256), nullable=True)
    sla_deadline = Column(DateTime(timezone=True), nullable=True)
    attendance_type = Column(String(32), default=AttendanceType.NORMAL)

    credential = Column(Text, nullable=True)
    call_token = Column(String(64), nullable=True, index=True)
    call_token_expires_at = Column(DateTime(timezone=True), nullable=True)

    attempted_verification = Column(Boolean, default=False, nullable=False)
    credential_verified = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="queue_items", lazy="joined")

    __table_args__ = (
        Index("ix_queue_items_status_priority", "status", "priority_score"),
        Index("ix_queue_items_user_id", "user_id"),
        CheckConstraint("position >= 0", name="ck_queue_position_non_negative"),
        CheckConstraint("priority_score >= 0", name="ck_queue_priority_non_negative"),
        CheckConstraint(
            "(status != 'being_served') OR (credential_verified = TRUE)",
            name="ck_served_requires_credential_verified",
        ),
    )

    # -------------------------
    # Métodos utilitários
    # -------------------------

    def reset_authentication_state(self) -> None:
        """Limpa completamente qualquer estado de autenticação."""
        self.credential = None
        self.credential_verified = False
        self.attempted_verification = False
        self.call_token = None
        self.call_token_expires_at = None

    def is_expired(self) -> bool:
        """Retorna True se o ‘item’ excedeu o SLA definido."""
        if self.sla_deadline is None:
            return False
        return datetime.now(timezone.utc) > self.sla_deadline

    def set_sla_deadline(self, minutes: int):
        """Define o prazo máximo (SLA) em minutos a partir do momento atual."""
        if minutes is None:
            self.sla_deadline = None
        else:
            self.sla_deadline = datetime.now(timezone.utc) + timedelta(minutes=minutes)

    @validates("status")
    def validate_status(self, key, value):
        """Valida o status contra os valores definidos em QueueStatus."""
        allowed = [s.value for s in QueueStatus]
        if value not in allowed:
            raise ValueError(f"Status inválido: '{value}'. Esperado: {allowed}")
        return value

    @validates("attendance_type")
    def validate_attendance_type(self, key, value):
        """Valida o tipo de atendimento."""
        allowed = [t.value for t in AttendanceType]
        if value not in allowed:
            raise ValueError(
                f"Tipo de atendimento inválido: '{value}'. Esperado: {allowed}"
            )
        return value

    def promote_priority(self, increment: int = 1):
        """Incrementa a prioridade, respeitando limites mínimos."""
        self.priority_score = max(0, self.priority_score + increment)

    def demote_priority(self, decrement: int = 1):
        """Reduz a prioridade, sem permitir valores negativos."""
        self.priority_score = max(0, self.priority_score - decrement)
