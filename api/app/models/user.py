from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime
from app.db.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    id_number = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)

    is_pregnant = Column(Boolean, default=False, nullable=False)
    pregnant_until = Column(DateTime(timezone=True), nullable=True)
    is_disabled_temp = Column(Boolean, default=False, nullable=False)
    disabled_until = Column(DateTime(timezone=True), nullable=True)

    queue_items = relationship("QueueItem", back_populates="user")
    credentials = relationship("UserCredential", back_populates="user", cascade="all, delete-orphan")
    audits = relationship("Audit", back_populates="user")
