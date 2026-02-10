# models/audit.py
from enum import Enum

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship, validates
from datetime import datetime, timezone
from app.db.base import Base
import hashlib


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)

    # FK separadas
    operator_id = Column(Integer, ForeignKey("operators.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    queue_item_id = Column(Integer, ForeignKey("queue_items.id", ondelete="SET NULL"), nullable=True)
    credential_id = Column(Integer, ForeignKey("user_credentials.id", ondelete="SET NULL"), nullable=True)

    action = Column(String(255), nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    details = Column(JSON, nullable=True)

    hashed_previous = Column(String(64), nullable=True)
    hashed_record = Column(String(64), nullable=False, unique=True)

    operator = relationship("Operator", lazy="joined")
    user = relationship("User", lazy="joined")
    queue_item = relationship("QueueItem", lazy="joined")
    credential = relationship("UserCredential", lazy="joined")

    __table_args__ = (Index("ix_audits_action_timestamp", "action", "timestamp"),)

    @validates("action")
    def validate_action(self, key, value):
        if isinstance(value, Enum):
            value = value.value

        if not value or not value.strip():
            raise ValueError("Campo 'action' não pode ser vazio.")
        if len(value) > 255:
            raise ValueError("Campo 'action' ultrapassa 255 caracteres.")
        return value.strip()

    def finalize_record(self):
        payload = {
            "timestamp": str(self.timestamp or ""),
            "action": str(self.action or ""),
            "details": str(self.details or ""),
            "user_id": str(self.user_id or ""),
            "queue_item_id": str(self.queue_item_id or ""),
            "credential_id": str(self.credential_id or ""),
            "operator_id": str(self.operator_id or ""),
            "hashed_previous": str(self.hashed_previous or ""),
        }
        concatenated = "|".join(f"{k}:{v}" for k, v in sorted(payload.items()))
        self.hashed_record = hashlib.sha256(concatenated.encode("utf-8")).hexdigest()
        return self.hashed_record
