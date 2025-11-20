# Queue Management System

Este monorepo reúne todos os componentes do sistema de gestão de filas desenvolvido no âmbito da monografia.
Cada módulo é independente, com responsabilidades bem definidas e preparado para desenvolvimento, testes e deploy isolados.

## Estrutura do Repo

### Apps

- **ui/**: Interface React orientada ao público, responsável pela apresentação do estado da fila em tempo real.
- **ui-admin/**: Frontend React Admin para administração da fila, operadores e relatórios.
- **api/**: Serviço FastAPI que centraliza a lógica de negócio: gestão de tickets, autenticação, notificações e integração com outros módulos.
- **middleware/**: Serviço em C# dedicado à leitura biométrica e comunicação entre dispositivos físicos e a API.

### Package

- **ds/**: Design System partilhado, contendo tokens de estilo, componentes reutilizáveis e guidelines de interface.

### Docs

- **architecture.md**: Visão geral da arquitectura, fluxos principais e decisões estruturais.
- **api-contracts.md**: Especificação dos endpoints expostos pela API.
- **design-system.md**: Convenções, padrões visuais e regras do Design System.

### Infra

- **docker-compose.yml**: Estrutura para iniciar os serviços.
