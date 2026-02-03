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
├── app/
│   ├── App.tsx                   # Componente raiz <Admin>, registra recursos 
│   ├── dataProvider.ts           # Comunicação com API REST/GraphQL
│   ├── authProvider.ts           # Autenticação e permissões
│   └── routes.tsx                # Rotas customizadas (opcional)
│
├── config/
│   ├── theme.ts                  # Tema do Material UI
│   ├── i18n.ts                   # Traduções
│   └── constants.ts              # Constantes globais
│
├── services/
│   ├── usersService.ts           # Funções específicas de API para usuários
│   ├── postsService.ts
│   └── index.ts                  # Exporta todos os serviços centralizados
│
├── types/
│   ├── users.ts                  # Interfaces e tipos do recurso users
│   ├── posts.ts                  # Interfaces e tipos do recurso posts
│   └── global.d.ts               # Tipos globais ou declarações externas
│
├── components/
│   ├── inputs/
│   │   ├── CustomTextInput.tsx
│   │   └── RichTextInput.tsx
│   ├── buttons/
│   │   └── ExportButton.tsx
│   ├── filters/
│   │   └── UserFilter.tsx
│   └── layout/
│       ├── CustomMenu.tsx
│       ├── CustomDashboard.tsx
│       └── Sidebar.tsx
│
├── features/
│   ├── users/
│   │   ├── UserList.tsx
│   │   ├── UserEdit.tsx
│   │   ├── UserCreate.tsx
│   │   ├── UserShow.tsx
│   │   └── __tests__/            # Testes do recurso
│   ├── posts/
│   │   ├── PostList.tsx
│   │   ├── PostEdit.tsx
│   │   ├── PostCreate.tsx
│   │   └── PostShow.tsx
│   └── ...                       # Outros recursos
│
├── utils/
│   ├── helpers.ts                # Funções utilitárias
│   └── formatters.ts             # Formatação de datas, moedas, etc.
│
└── index.tsx                      # Entrada principal da aplicação
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