# models/audit.py
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship, validates
from datetime import datetime, timezone
from app.db.base import Base
import hashlib, json


class Audit(Base):
    __tablename__ = "audits"

    id = Column(Integer, primary_key=True, index=True)

    # FKs de Referência do Evento
    operator_id = Column(Integer, ForeignKey("operators.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    queue_item_id = Column(Integer, ForeignKey("queue_items.id", ondelete="SET NULL"), nullable=True)
    credential_id = Column(Integer, ForeignKey("user_credentials.id", ondelete="SET NULL"), nullable=True)

    # Dados do Evento
    action = Column(String(255), nullable=False)
    timestamp = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    details = Column(JSON, nullable=True)

    # Prova Criptográfica
    hashed_previous = Column(String(64), nullable=True)
    hashed_record = Column(String(64), nullable=False, unique=True)

    # Campos de Investigação (Metadados Pós-Evento - NÃO entram no Hash)
    investigation_note = Column(String(500), nullable=True)
    investigated_at = Column(DateTime(timezone=True), nullable=True)
    investigated_by_id = Column(Integer, ForeignKey("operators.id"), nullable=True)

    # RELAÇÕES (Corrigidas com foreign_keys para evitar ambiguidade)
    operator = relationship("Operator", foreign_keys=[operator_id], lazy="joined")
    investigator = relationship("Operator", foreign_keys=[investigated_by_id], lazy="select")

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
        """Calcula e fixa o hash do registro."""
        self.hashed_record = self.compute_record_hash()
        return self.hashed_record

    def compute_record_hash(self) -> str:
        """
        Gera hash SHA-256 determinístico baseando-se apenas nos dados imutáveis do evento.
        Campos de investigação são excluídos para permitir anotações sem quebrar a cadeia.
        """
        # ISO 8601 UTC fixo: 2026-02-16T08:38:10Z
        ts_str = self.timestamp.astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ') if self.timestamp else ""

        # JSON canónico (chaves ordenadas, sem espaços extras)
        details_json = json.dumps(
            self.details or {},
            sort_keys=True,
            separators=(',', ':')
        )

        # Construção do payload com proteção contra ID 0
        payload = {
            "timestamp": ts_str,
            "action": str(self.action) if self.action is not None else "",
            "details": details_json,
            "user_id": str(self.user_id) if self.user_id is not None else "",
            "queue_item_id": str(self.queue_item_id) if self.queue_item_id is not None else "",
            "credential_id": str(self.credential_id) if self.credential_id is not None else "",
            "operator_id": str(self.operator_id) if self.operator_id is not None else "",
            "hashed_previous": str(self.hashed_previous) if self.hashed_previous is not None else "",
        }

        # Concatenação pipe-separated ordenada por chave
        concatenated = "|".join(f"{k}:{payload[k]}" for k in sorted(payload.keys()))

        return hashlib.sha256(concatenated.encode("utf-8")).hexdigest()