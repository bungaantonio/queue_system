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
git fetch origin
git rebase origin/main
git push origin main

```

### Criar feature

```bash
git checkout -b feature/descricao-curta
git push -u origin feature/descricao-curta
```


### Desenvolvimento

#### (editar código)

```bash
git add <ficheiros>
git commit -m "feat: descricao clara"
git push
```

### Manter a branch actualizada

```bash
git fetch origin
git checkout main
git rebase origin/main
git checkout feature/descricao-curta
git rebase main
git push
```

### Repetir commits conforme necessário

```bash
git add <ficheiros>
git commit -m "fix: ajuste X"
git push
```

### Antes de PR

```bash
git fetch upstream
git rebase upstream/main
# executar testes do projeto
git push
```

### Limpeza após merge

```bash
git checkout main
git fetch upstream
git rebase upstream/main
git push origin main
git branch -d feature/descricao-curta
git push origin --delete feature/descricao-curta
```

### Recuperação de erro comum (extra importante)

#### Fiz commits por engano em `main`

```bash
git checkout -b feature/descricao-curta
git checkout main
git fetch upstream
git reset --hard upstream/main
git push --force-with-lease origin main
```

### Higiene do repositório (extra)

```bash
git branch -vv
git branch -d <branch-inutil>
```
