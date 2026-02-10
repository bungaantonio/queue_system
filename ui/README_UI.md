# Documentação rápida – UI Admin (React Admin)

## Preparar dependências

```bash
# Dentro da pasta ui-admin
npm install
# ou usando yarn
# yarn install
```

## Rodar desenvolvimento

```bash
npm run dev
```

* Vite inicia o servidor de desenvolvimento com hot reload
* Acesse a UI Admin em <http://localhost:3001>

## Build produção

```bash
npm run build
```

* Cria a versão otimizada da aplicação em `dist/`
* Pronto para ser servida por Nginx ou outro servidor web

## Servir build localmente

```bash
npm run serve
```

* Serve o conteúdo de dist/ localmente para testes de produção
* Acesse em <http://localhost:4173> (porta mostrada no terminal)

## Linter, formatação e TypeScript

```bash
# Verifica e corrige problemas de lint
npm run lint

# Checa tipos TypeScript
npm run type-check

# Formata código com Prettier
npm run format
```

## Docker (desenvolvimento com hot reload)

```bash
docker-compose up --build ui-dev
```

* Usa `Dockerfile.ui.dev`
* Monta código local como volume para hot reload
* UI Admin disponível em <http://localhost:5173>
* FastAPI continua disponível em <http://localhost:8000>

> Para produção, trocar Dockerfile.ui.dev por Dockerfile.ui e remover volumes de código

## Docker (produção)

```bash
docker-compose up --build ui
```

* Usa `Dockerfile.ui` (Nginx + build otimizado)
* UI Admin disponível em <http://localhost:3001>
* Comunicação com FastAPI via <http://app:8000> na rede Docker Compose
