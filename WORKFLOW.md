# TO DO

## Development Workflow (Daily)

### Regras

- Nunca desenvolver em `main`
- `main` espelha sempre `upstream/main`
- 1 branch por feature ou fix
- Rebase frequente, branches curtos

---

### Início do dia

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
```

### Criar feature

```bash
git checkout -b feature/descricao-curta
```

### Desenvolvimento

#### (editar código)

```bash
git add <ficheiros>
git commit -m "feat: descricao clara"
```

### Manter a branch actualizada

```bash
git fetch upstream
git checkout main
git rebase upstream/main
git checkout feature/descricao-curta
git rebase main
```

### Repetir commits conforme necessário

```bash
git add <ficheiros>
git commit -m "fix: ajuste X"
```

### Antes de PR

```bash
# executar testes do projecto
```

### Limpeza após merge

```bash
git checkout main
git branch -d feature/descricao-curta
git push origin --delete feature/descricao-curta
```
