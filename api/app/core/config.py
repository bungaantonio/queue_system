from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr


class Settings(BaseSettings):
    """Configurações principais da aplicação."""

    # --- Segurança e autenticação ---
    SECRET_KEY: SecretStr = Field(
        default=SecretStr("your-secret-key-change-in-production"),
        description="Chave secreta usada para assinar tokens JWT.",
    )
    ALGORITHM: str = Field(default="HS256", description="Algoritmo de encriptação JWT.")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60, description="Tempo de expiração do token de acesso (min)."
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7, description="Tempo de expiração do token de atualização (dias)."
    )
    TOKEN_EXPIRATION_MINUTES: int = Field(
        default=2, description="Tempo de expiração do token curto (min)."
    )
    SERVER_SECRET: SecretStr = Field(
        default=SecretStr("your-server-secret-change-in-production"),
        description="Segredo usado internamente pelo servidor.",
    )

    # --- Ambiente ---
    ENVIRONMENT: str = Field(
        default="development",
        description="Ambiente atual: development / staging / production.",
    )
    DEBUG: bool = Field(default=True, description="Ativa modo de depuração (DEBUG).")

    # --- Base de dados (exemplo) ---
    DATABASE_URL: str = Field(
        default="sqlite:///./test.db", description="URL de conexão à base de dados."
    )

    SYSTEM_OPERATOR_USERNAME: str = Field(
        default="biometric_gateway",
        description="Username do operador sistema (definido no seed).",
    )
    SYSTEM_OPERATOR_PASSWORD: str = Field(
        default="hashed_password_placeholder",
        description="Hash da senha do operador sistema (definido no seed).",
    )
    DEFAULT_ADMIN_USERNAME: str = Field(
        default="admin",
        description="Username do admin padrão (definido no seed).",
    )
    DEFAULT_ADMIN_PASSWORD: str = Field(
        default="123",
        description="Senha do admin padrão (definido no seed).",
    )
    # --- Configuração do modelo ---
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
