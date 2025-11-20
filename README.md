# Queue Management System

Este monorepo contém todos os componentes do sistema de gestão de filas desenvolvido para a monografia.

## Estrutura do Repo

### Apps

- **ui/**: Frontend React para apresentação da fila.
- **ui-admin/**: Frontend React Admin para administração da fila, operadores e relatórios.
- **api/**: FastAPI que gerencia a fila, autenticação, notificações.
- **middleware/**: Middleware em C# responsável pela leitura biométrica.

### Package

- **ui/**: Design System compartilhado, com tokens de estilo e componentes reutilizáveis.

### Docs

- **architecture.md**: Documentação da arquitetura do sistema.
- **api-contracts.md**: Resumo dos endpoints da API.
- **design-system.md**: Guia do Design System.

### Infra

- **docker-compose.yml**: Estrutura para iniciar os serviços.
