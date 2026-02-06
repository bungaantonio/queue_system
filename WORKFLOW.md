## Development Workflow (Daily)

### Regras

- Nunca desenvolver em `main`
- `main` espelha sempre `upstream/main`
- 1 branch por feature ou fix
- Rebase frequente, branches curtos

---

### Actualizar fork (início do dia)

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
```

### Desenvolver uma feature

```bash
git checkout -b feature/descricao-curta
```

### Manter a branch actualizada

```bash
git fetch upstream
git rebase upstream/main
git rebase main
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
