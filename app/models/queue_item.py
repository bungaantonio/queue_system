from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey
from datetime import datetime, timezone
from app.db.base import Base
from sqlalchemy.orm import relationship

class QueueItem(Base):
    __tablename__ = "queue_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, nullable=False, default="waiting")
    position = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    attempted_verification = Column(Boolean, default=False)

    # Garantir carregamento automático do relacionamento
    user = relationship(
        "User",
        back_populates="queue_items",
        lazy="joined",        # força JOIN automático
    )
