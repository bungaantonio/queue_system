
# api

## Instalação

```sh
python -m venv .temp
```

Ativar o ambiente:

```sh
.\.temp\Scripts\Activate.ps1
```

Instalar:

```sh
pip install -r requirements.txt
```

## Ambiente

Criar o `.env`, copiar o .env.example
Gerar uma string segura com:

```sh
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Dev

```sh
uvicorn app.main:app --reload
```

### Rodar PostgreSQL

```sh
docker-compose up -d
```

* Testar conexão:

```sh
psql postgresql://devuser:devpass@localhost:5432/devdb
```

* Rode migrations Alembic normalmente:

```sh
alembic upgrade head
```
