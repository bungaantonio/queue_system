import hashlib
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship, validates
from datetime import datetime, timezone
from app.db.base import Base


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)

    operator_id = Column(Integer, nullable=True, default=None)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    queue_item_id = Column(Integer, ForeignKey("queue_items.id", ondelete="SET NULL"), nullable=True)
    biometric_id = Column(Integer, ForeignKey("biometrics.id", ondelete="SET NULL"), nullable=True)

    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    details = Column(Text, nullable=True)

    hashed_previous = Column(String(64), nullable=True)
    hashed_record = Column(String(64), nullable=False, unique=True)

    user = relationship("User", lazy="joined")
    queue_item = relationship("QueueItem", lazy="joined")
    biometric = relationship("Biometric", lazy="joined")

    __table_args__ = (
        Index("ix_audits_action_timestamp", "action", "timestamp"),
    )

    def hashed_compute(self) -> str:
        """
        Gera o hash SHA256 do registro, garantindo integridade de sequência.
        O hash inclui dados essenciais e o hash anterior (se houver),
        formando uma cadeia de auditoria.
        """
        payload = {
            "timestamp": str(self.timestamp or ""),
            "action": str(self.action or ""),
            "details": str(self.details or ""),
            "user_id": str(self.user_id or ""),
            "queue_item_id": str(self.queue_item_id or ""),
            "biometric_id": str(self.biometric_id or ""),
            "operator_id": str(self.operator_id or ""),
            "hashed_previous": str(self.hashed_previous or ""),
        }

        # Concatenar de modo determinístico (ordem previsível)
        concatenated = "|".join(f"{k}:{v}" for k, v in sorted(payload.items()))
        return hashlib.sha256(concatenated.encode("utf-8")).hexdigest()

    @validates("action")
    def validate_action(self, key, value):
        """Impede ações vazias ou excessivamente longas."""
        if not value or not value.strip():
            raise ValueError("Campo 'action' não pode ser vazio.")
        if len(value) > 255:
            raise ValueError("Campo 'action' ultrapassa 255 caracteres.")
        return value.strip()

    def finalize_record(self):
        """
        Gera e grava o hash final do registro antes de inseri-lo.
        Pode ser chamado automaticamente via evento `before_insert`.
        """
        self.hashed_record = self.hashed_compute()
        return self.hashed_record
