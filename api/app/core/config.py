from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, SecretStr


class Settings(BaseSettings):
    """Configurações principais da aplicação."""

    # --- Segurança e autenticação ---
    SECRET_KEY: SecretStr = Field(..., description="Chave secreta usada para assinar tokens JWT.")
    ALGORITHM: str = Field(default="HS256", description="Algoritmo de encriptação JWT.")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60, description="Tempo de expiração do token de acesso (min).")
    TOKEN_EXPIRATION_MINUTES: int = Field(default=2, description="Tempo de expiração do token curto (min).")
    SERVER_SECRET: SecretStr = Field(..., description="Segredo usado internamente pelo servidor.")

    # --- Ambiente ---
    ENVIRONMENT: str = Field(default="development", description="Ambiente atual: development / staging / production.")
    DEBUG: bool = Field(default=True, description="Ativa modo de depuração (DEBUG).")

    # --- Base de dados (exemplo) ---
    DATABASE_URL: str | None = Field(default=None, description="URL de conexão à base de dados.")

    # --- Configuração do modelo ---
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
