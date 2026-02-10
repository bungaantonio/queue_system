
# Projeto – Guia rápido de execução

## Pré-requisitos

- Docker
- Docker Compose

---

## Desenvolvimento

Usa hot reload para backend e frontends.

```bash
docker compose -f docker-compose.dev.yml up --build
```

Serviços disponíveis:

- API (FastAPI): [http://localhost:8000](http://localhost:8000)
- UI Admin: [http://localhost:3002](http://localhost:3002)
- Queue Display: [http://localhost:3001](http://localhost:3001)
- Postgres: localhost:5432

---

## Produção

Usa imagens otimizadas, sem hot reload ou volumes de código.

```bash
docker compose up -d --build
```

Serviços disponíveis:

- API (FastAPI): [http://localhost:8000](http://localhost:8000)
- UI Admin: [http://localhost:3000](http://localhost:3000)
- Queue Display: [http://localhost:3001](http://localhost:3001)

> Em produção, o Postgres não é exposto externamente.

---

## Variáveis de ambiente

Criar arquivo `.env` na raiz do projeto com as configurações necessárias
(banco de dados, segredos e tokens).

---

## Encerrar serviços

```bash
docker compose -f docker-compose.dev.yml down
```

Produção:

```bash
docker compose down
```

> docker compose down -v

### Dockerfiles de cada serviço

| Serviço            | Dockerfile dev                     | Dockerfile produção            |
| ------------------ | ---------------------------------- | ------------------------------ |
| API (FastAPI)      | `api/Dockerfile.api.dev`           | `api/Dockerfile.api`           |
| UI Admin           | `ui-admin/Dockerfile.ui-admin.dev` | `ui-admin/Dockerfile.ui-admin` |
| Queue Display (UI) | `ui/Dockerfile.ui.dev`             | `ui/Dockerfile.ui`             |

---

> Extras (para teste individual):
>> docker-compose -f docker-compose.prod.yml up --build app
