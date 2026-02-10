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
git fetch origin        # Baixar as últimas mudanças do repositório remoto
git rebase origin/main  # Sincronizar com a versão remota da 'main'
git push origin main    # Se houver algo novo, enviar para o remoto
```

### Criar feature

```bash
git checkout -b feature/descricao-curta
git push -u origin feature/descricao-curta  # Envia a branch e cria o link com o remoto
```

### Desenvolvimento

#### (editar código)

```bash
git add <arquivos>
git commit -m "feat: Implementa a funcionalidade X"
git push  # Enviar os commits para o remoto
```

### Manter a branch actualizada

```bash
git fetch origin       # Baixar as últimas alterações do repositório remoto
git checkout main      # Garantir que está na branch principal
git rebase origin/main # Aplicar alterações da 'main' remota na sua branch
git checkout feature/descricao-curta  # Voltar para a branch de feature
git rebase main        # Atualizar a branch de feature com a 'main'
git push               # Enviar as mudanças para o remoto
```

### Antes de PR

```bash
git fetch origin
git rebase origin/main   # Certifique-se de que a sua branch esteja alinhada com a 'main'
# Executar os testes para garantir que nada foi quebrado
git push                # Enviar quaisquer mudanças finais para o remoto
```

### Limpeza após merge

```bash
git checkout main       # Voltar para a branch principal
git fetch origin        # Baixar as últimas mudanças
git rebase origin/main  # Garantir que a 'main' está atualizada
git push origin main    # Se necessário, envie as alterações
git branch -d feature/descricao-curta  # Apagar a branch local
git push origin --delete feature/descricao-curta  # Apagar a branch remota
```

### Recuperação de erro comum (extra importante)

#### Fiz commits por engano em `main`

```bash
git checkout -b feature/descricao-curta
git checkout main
git fetch origin
git reset --hard origin/main    # Alinhar a 'main' local com a remota
git push --force-with-lease origin main   # Forçar o envio da 'main' corrigida
```

### Higiene do repositório (extra)

```bash
git branch -vv
git branch -d <branch-inutil>
```
