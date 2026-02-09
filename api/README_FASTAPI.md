# Documentação rápida – FastAPI

## Preparar dependências

```bash
mkdir requirements
# criar base.in e dev.in
pip install pip-tools
pip-compile requirements/base.in -o requirements/base.txt
pip-compile requirements/dev.in -o requirements/dev.txt
```

## Instalar

* Produção

```bash
pip install -r requirements/base.txt
```

* Desenvolvimento

```bash
pip install -r requirements/dev.txt
```

## Variáveis de ambiente

Criar arquivo `.env` com as principais configurações do FastAPI e banco:

```bash
SECRET_KEY="replace_me"
SERVER_SECRET="replace_me"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7
TOKEN_EXPIRATION_MINUTES=2
ENVIRONMENT="development"
DEBUG=True

POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppassword
POSTGRES_DB=appdb
POSTGRES_PORT=5432
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:${POSTGRES_PORT}/${POSTGRES_DB}

SYSTEM_OPERATOR_USERNAME="biometric_gateway"
SYSTEM_OPERATOR_PASSWORD="hashed_password_placeholder"
DEFAULT_ADMIN_USERNAME="admin"
DEFAULT_ADMIN_PASSWORD="123"
```

## Docker (desenvolvimento)

```bash
docker-compose up --build
```

* FastAPI disponível em <http://localhost:8000>
* Postgres disponível na porta 5432

> Para produção, trocar Dockerfile.dev por Dockerfile no docker-compose e remover volumes de código.

## Docker (produção)

```bash
docker-compose up --build app
```

* Usa `Dockerfile.api` (produção)
* FastAPI disponível em [http://localhost:8000](http://localhost:8000)
* Postgres disponível na porta 5432

> Certifique-se de remover volumes de código do `docker-compose` para não sobrescrever o container de produção.
