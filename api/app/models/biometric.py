from sqlalchemy import JSON, Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base


class UserCredential(Base):
    __tablename__ = "user_credentials"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 'zkteco' ou 'webauthn'
    cred_type = Column(String(20), nullable=False)

    # Para ZK: o Hash do ID. Para WebAuthn: a Public Key.
    identifier = Column(Text, nullable=False)

    # Para WebAuthn: guarda metadados como sign_count
    extra_data = Column(JSON, nullable=True)


class Biometric(Base):
    __tablename__ = "biometrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Identificador determinístico ou hash/HMAC do template biométrico
    biometric_id = Column(String, nullable=False, unique=True, index=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="biometric")
