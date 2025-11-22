
# api

## Instalação

```sh
python -m venv .temp
```

```sh
pip install -r requirements.txt
```

## Ambiente

Criar o `.env`, copiar o .env.example
Gerar uma string segura com:

```sh
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
