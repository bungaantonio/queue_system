---
config:
  theme: neo
---
sequenceDiagram
    autonumber
    participant Sistema
    participant ItemFila
    participant Fila
    participant RegistoAuditoria

    %% Criação do item de fila
    Sistema->>ItemFila: Criar ItemFila
    ItemFila-->>Sistema: ItemFila criado
    note right of ItemFila: Representa a entrada lógica na fila

    %% Cálculo de prioridade
    Sistema->>Fila: Calcular prioridade
    Fila-->>Sistema: Prioridade calculada
    note right of Fila: Define a posição relativa na fila

    %% Inserção na fila
    Sistema->>Fila: Inserir ItemFila na fila
    note right of Fila: Item adicionado segundo a prioridade

    %% Registo de auditoria
    Sistema->>RegistoAuditoria: Registar inserção na fila
    RegistoAuditoria-->>Sistema: Registo concluído
    note right of RegistoAuditoria: Histórico da operação RF02

    %% Confirmação final
    Sistema-->>Sistema: Inserção confirmada
    note left of Sistema: Processo automático concluído com sucesso
