app/
├── crud/
│   ├── user/
│   │   ├── create.py
│   │   ├── read.py
│   │   ├── update.py
│   │   ├── delete.py
│   │   └── __init__.py
│   ├── queue/
│   │   ├── create.py
│   │   ├── read.py
│   │   ├── update.py
│   │   ├── delete.py
│   │   └── __init__.py
│   ├── biometric/
│   │   ├── create.py
│   │   ├── read.py
│   │   ├── update.py
│   │   ├── delete.py
│   │   └── __init__.py
│   └── __init__.py

Estrutura CRUD Modular

A camada crud/ foi organizada por domínio (user, queue, biometric), e cada um contém ficheiros separados para as operações básicas: create.py, read.py, update.py e delete.py.

Esse formato torna o código mais limpo, modular e fácil de manter, evitando conflitos de nomes e facilitando as importações via __init__.py.

Exemplo:

from app.crud.user import create_user
from app.crud.queue import get_queue



Gerar chave segura
python -c "import secrets; print(secrets.token_urlsafe(64))"
