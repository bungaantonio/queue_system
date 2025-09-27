import hashlib
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from app.db.database import Base


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)

    operator_id = Column(Integer, nullable=True, default=None)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    queue_item_id = Column(Integer, ForeignKey("queue_items.id"), nullable=True)
    biometric_id = Column(Integer, ForeignKey("biometrics.id"), nullable=True)

    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    details = Column(Text, nullable=True)

    previous_hash = Column(String, nullable=True)
    record_hash = Column(String, nullable=False)

    def compute_hash(self):
        """Gera o hash SHA256 do registro."""
        data = (
            str(self.timestamp)
            + str(self.action)
            + str(self.details or "")
            + str(self.user_id or "")
            + str(self.queue_item_id or "")
            + str(self.biometric_id or "")
            + str(self.operator_id or "")
            + str(self.previous_hash or "")
        )
        return hashlib.sha256(data.encode("utf-8")).hexdigest()
