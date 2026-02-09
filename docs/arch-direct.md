## React

```bash
src/
│
├── main.tsx
│
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/
│       └── QueueStreamProvider.tsx   ← controla SSE globalmente
│
├── core/                              ← infraestrutura isolada
│   ├── http/
│   │   └── apiClient.ts               ← apenas se necessário
│   │
│   ├── stream/
│   │   ├── sseClient.ts               ← wrapper do EventSource
│   │   └── streamEvents.ts            ← tipagem dos eventos
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   └── errors/
│       └── ApiError.ts
│
├── domain/                            ← modelo de domínio do display
│   └── queue/
│       ├── queue.types.ts
│       ├── queue.mapper.ts            ← transforma payload da API
│       ├── queue.state.ts             ← shape oficial do estado
│       └── queue.selectors.ts         ← lógica derivada
│
├── features/                          ← funcionalidades visuais reais
│   ├── called-user/
│   │   ├── CalledUser.tsx
│   │   └── useCalledUser.ts
│   │
│   ├── waiting-list/
│   │   ├── WaitingList.tsx
│   │   └── useWaitingList.ts
│   │
│   └── timer/
│       ├── Timer.tsx
│       └── useTimer.ts
│
├── ui/                                ← componentes puros reutilizáveis
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── EmptyState.tsx
│
└── shared/
    └── formatters.ts
```

## React Admin

```bash
src/
│
├── main.tsx                         # Bootstrap da aplicação (ReactDOM)
│
├── application/                     # Integração com React Admin (framework layer)
│   ├── adminApp.tsx                 # Componente <Admin>
│   ├── adminAuthProvider.ts         # Adapter do React Admin para sessão
│   ├── adminDataProvider.ts         # Adapter do React Admin para API
│   └── adminRoutes.tsx              # Rotas customizadas (se necessário)
│
├── core/                            # Infraestrutura transversal (não depende de RA)
│   │
│   ├── http/
│   │   ├── apiClient.ts             # Cliente HTTP base (fetch + headers + error mapping)
│   │   ├── ApiError.ts              # Tipagem estruturada de erro
│   │   └── httpTypes.ts
│   │
│   ├── session/
│   │   ├── sessionStorage.ts        # get/set/clear token
│   │   └── sessionManager.ts        # Regras de sessão (expiração, etc.)
│   │
│   └── config/
│       ├── env.ts                   # Variáveis de ambiente
│       └── appConstants.ts          # Constantes estruturais
│
├── ui/                              # Componentes reutilizáveis (UI pura)
│   ├── inputs/
│   ├── buttons/
│   ├── filters/
│   └── layout/
│
├── modules/                         # Domínio real do sistema
│   │
│   ├── operators/
│   │   ├── operatorsGateway.ts      # Comunicação API do domínio
│   │   ├── operators.types.ts
│   │   ├── OperatorsList.tsx
│   │   ├── OperatorsCreate.tsx
│   │   ├── OperatorsEdit.tsx
│   │   └── __tests__/
│   │
│   ├── utentes/
│   │   ├── utentesGateway.ts
│   │   ├── utentes.types.ts
│   │   ├── components/
│   │   │   └── BiometricInput.tsx
│   │   ├── UtentesList.tsx
│   │   ├── UtentesCreate.tsx
│   │   └── UtentesEdit.tsx
│   │
│   ├── biometria/
│   │   ├── biometriaGateway.ts
│   │   └── biometria.types.ts
│   │
│   ├── atendimento/
│   │   ├── atendimentoGateway.ts
│   │   ├── ControlPanel.tsx
│   │   └── atendimento.types.ts
│   │
│   └── dashboard/
│       └── DashboardPage.tsx
│
└── shared/                          # Utilitários realmente genéricos
    ├── dateFormatter.ts
    ├── currencyFormatter.ts
    └── helpers.ts
```

## FastAPI

```bash
src/
└── app/
    ├── api/
    │   └── v1/
    │       ├── endpoints/
    │       │   ├── auth.py          # Login, Refresh, Logout
    │       │   ├── biometrics.py    # Request-capture, Register-capture
    │       │   ├── queue.py         # Register, Call-next, Finish, Skip
    │       │   ├── users.py         # List, Get, Update Utentes
    |       │   ├── operators.py     #
    │       │   └── audit.py         # List, Verify-chain, Summary
    │       └── router.py            # Agregador de rotas v1
    ├── core/
    │   ├── config.py                # Variáveis de ambiente
    │   ├── security.py              # JWT, get_current_user
    │   ├── errors.py
    │   ├── exceptions.py
    │   └── sse_manager.py           # Broadcaster do SSE
    ├── crud/
    │   ├── audit_crud.py            # Operações básicas de Auditoria
    │   ├── biometric_crud.py        # Operações básicas de Biometria
    │   ├── queue_crud.py            # Operações básicas de Fila
    │   ├── operators.py             # Operações básicas de Operador
    │   └── user_crud.py             # Operações básicas de Utente
    ├── db/
    │   ├── base.py                  # Importa todos os models para o Alembic
    │   ├── database.py              # SessionLocal e get_db
    │   └── session.py               # Utilitários de sessão
    ├── helpers/                     # Lógica pura (Priority, SLA, TTS)
    ├── models/                      # Suas classes SQLAlchemy
    ├── schemas/                     # Seus Pydantic Models (Request/Response)
    ├── services/                    # O CÉREBRO (Onde o commit e a auditoria vivem)
    │   ├── audit_service.py         # Lógica de Hashing e Verificação
    │   ├── biometric_service.py     # Coordenação Hardware <-> Cache
    │   ├── queue_service.py         # Regras de Negócio da Fila
    │   ├── operators_service.py
    │   └── user_service.py          # Gestão de Utentes
    └── main.py                      # Ponto de entrada do FastAPI
```
