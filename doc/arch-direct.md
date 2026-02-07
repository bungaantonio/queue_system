## React

```bash
src/
├── app/
│   ├── App.tsx                  # Componente raiz, roteamento principal
│   ├── routes.tsx               # Rotas (React Router)
│   └── providers/               # Contextos globais (auth, theme)
│       ├── AuthProvider.tsx
│       └── ThemeProvider.tsx
│
├── components/
│   ├── ui/                      # Componentes genéricos e reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/                  # Menu, sidebar, header, footer
│   └── widgets/                 # Componentes mais complexos, dashboards
│
├── features/
│   ├── users/
│   │   ├── UsersList.tsx
│   │   ├── UsersForm.tsx        # Edit/Create combinados
│   │   └── types.ts             # Interfaces TS específicas do recurso
│   ├── posts/
│   │   ├── PostsList.tsx
│   │   ├── PostsForm.tsx
│   │   └── types.ts
│   └── ...
│
├── services/                    # Comunicação com API
│   ├── usersService.ts
│   ├── postsService.ts
│   └── api.ts                   # Axios/fetch base
│
├── hooks/                       # Hooks customizados
│   ├── useUsers.ts
│   ├── usePosts.ts
│   └── useAuth.ts
│
├── utils/                       # Funções auxiliares e formatações
│   ├── helpers.ts
│   └── formatters.ts
│
├── types/                       # Tipos globais
│   └── global.d.ts
│
└── index.tsx

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
    ├── errors/                      # Seus build_examples.py e mapeamentos
    ├── exceptions/                  # Suas classes QueueException e o Handler
    ├── helpers/                     # Lógica pura (Priority, SLA, TTS)
    ├── messages/                    # Seus dicionários QUEUE_ERRORS
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
