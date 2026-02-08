# app/models/user_credential.py
from sqlalchemy import Column, Integer, String, ForeignKey, Text, JSON, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class UserCredential(Base):
    __tablename__ = "user_credentials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Tipo: 'zkteco' (hardware) ou 'webauthn' (mobile/passkey)
    cred_type = Column(Enum("zkteco", "webauthn", name="credential_type"), nullable=False)
    
    # O identificador seguro (Hash HMAC para ZK ou Public Key para WebAuthn)
    identifier = Column(Text, nullable=False, unique=True)
    
    # Metadados opcionais (ex: "Samsung S23", "Dedo Indicador Direito")
    extra_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="credentials")