---
config:
  theme: neo
---
sequenceDiagram
    autonumber
    participant Operador
    participant Sistema
    participant Utente
    participant Biometria
    participant ItemFila
    participant Fila
    participant RegistoAuditoria

    %% Operador inicia registo
    Operador->>+Sistema: Iniciar registo de utente
    note right of Operador: Operador solicita início do processo de registo

    %% Verificação de duplicidade
    Sistema->>Utente: Verificar duplicidade
    Utente-->>Sistema: Resultado da duplicidade
    note right of Sistema: Garante que o utente não exista previamente

    alt Utente duplicado
        Sistema-->>Operador: Notificação de duplicidade
        note left of Sistema: Processo interrompido, registo não criado
    else Utente novo
        %% Criação do Utente
        Sistema->>Utente: Criar registo do utente
        Utente-->>Sistema: Utente criado
        note right of Sistema: Dados básicos registados com sucesso

        %% Registo da biometria
        Sistema->>Biometria: Registar biometria
        Biometria-->>Sistema: Biometria registada
        note right of Biometria: Captura e validação dos dados biométricos

        %% Criação do item da fila
        Sistema->>ItemFila: Criar ItemFila
        ItemFila-->>Sistema: ItemFila criado

        %% Atualização da fila
        Sistema->>Fila: Atualizar Fila
        note right of Fila: Utente adicionado à fila de atendimento

        %% Registo de auditoria
        Sistema->>RegistoAuditoria: Registar ações críticas
        RegistoAuditoria-->>Sistema: Ações registadas
        note right of RegistoAuditoria: Histórico completo do processo

        %% Confirmação final para o operador
        Sistema-->>Operador: Confirmação de registo completo
        note left of Sistema: Inclui utente registado, biometria validada e entrada na fila
    end