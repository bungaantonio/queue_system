from sqlalchemy import Column, Integer, String, Date
from app.db.base import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    id_number = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)

    # relação reversa com QueueItem
    queue_items = relationship("QueueItem", back_populates="user")
    biometric = relationship("Biometric", uselist=False, back_populates="user")
