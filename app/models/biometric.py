from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class Biometric(Base):
    __tablename__ = "biometrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    template = Column(String, nullable=False)
    hash = Column(String, nullable=False)
    finger_index = Column(Integer, nullable=False)

    user = relationship("User", back_populates="biometric")
