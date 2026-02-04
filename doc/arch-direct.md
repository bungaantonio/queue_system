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
backend/
├── app/
│   ├── main.py                # Inicializa FastAPI, inclui routers
│   ├── core/
│   │   ├── config.py          # Configurações do projeto (env, DB)
│   │   └── security.py        # JWT, auth helpers
│   ├── db/
│   │   ├── base.py            # Base declarativa do SQLAlchemy
│   │   ├── session.py         # Session maker / engine
│   │   └── models/            # Modelos do SQLAlchemy
│   │       ├── user.py
│   │       ├── post.py
│   │       └── __init__.py
│   ├── schemas/
│   │   ├── user.py            # Pydantic models
│   │   ├── post.py
│   │   └── __init__.py
│   ├── crud/
│   │   ├── user.py            # Funções de acesso a dados
│   │   ├── post.py
│   │   └── __init__.py
│   ├── api/
│   │   ├── deps.py            # Dependências de injeção (DB, Auth)
│   │   ├── routers/
│   │   │   ├── user.py
│   │   │   ├── post.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   └── utils/
│       ├── hashing.py         # Funções de hash de senha
│       └── helpers.py         # Funções auxiliares
│
├── tests/
│   ├── test_users.py
│   └── test_posts.py
│
└── requirements.txt
```