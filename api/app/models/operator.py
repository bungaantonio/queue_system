from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Index,
    CheckConstraint,
)
from datetime import datetime, timezone
from sqlalchemy.orm import validates
from app.db.database import Base
from app.models.enums import OperatorRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, nullable=False, index=True)
    hashed_password = Column(String(128), nullable=False)
    role = Column(String(32), nullable=False, default=OperatorRole.ATTENDANT.value)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), index=True
    )
    last_login = Column(DateTime, nullable=True)
    last_activity = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("ix_operators_role_active", "role", "active"),
        CheckConstraint("length(username) >= 3", name="ck_operator_username_minlen"),
    )

    # -------------------------
    # Métodos de segurança
    # -------------------------

    def set_password(self, raw_password: str):
        """Gera hash seguro da senha usando bcrypt."""
        if not raw_password or len(raw_password) < 6:
            raise ValueError("A senha deve conter pelo menos 6 caracteres.")
        self.hashed_password = pwd_context.hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        """Verifica se a senha fornecida corresponde ao hash armazenado."""
        return pwd_context.verify(raw_password, self.hashed_password)

    def mark_login(self):
        """Atualiza a data de último login."""
        self.last_login = datetime.now(timezone.utc)

    def mark_activity(self):
        """Atualiza a data de última ação."""
        self.last_activity = datetime.now(timezone.utc)

    # -------------------------
    # Validações
    # -------------------------

    @validates("username")
    def validate_username(self, key, value):
        value = value.strip().lower()
        if len(value) < 3:
            raise ValueError("O nome de usuário deve conter pelo menos 3 caracteres.")
        if " " in value:
            raise ValueError("O nome de usuário não pode conter espaços.")
        return value

    @validates("role")
    def validate_role(self, key, value):
        allowed = [r.value for r in OperatorRole]
        if value not in allowed:
            raise ValueError(f"Função inválida: '{value}'. Esperado: {allowed}")
        return value

    # -------------------------
    # Operações
    # -------------------------

    def deactivate(self):
        self.active = False

    def activate(self):
        self.active = True
