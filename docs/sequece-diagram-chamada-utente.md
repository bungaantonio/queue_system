---
config:
  theme: neo
---
sequenceDiagram
    autonumber
    participant Operador
    participant Sistema
    participant ItemFila
    participant Atendimento
    participant ChamadaFila
    participant Fila
    participant RegistoAuditoria

    %% Operador inicia a chamada
    Operador->>Sistema: Chamar utente
    note right of Operador: Pedido explícito para chamar o próximo utente

    %% Sistema solicita próximo item à fila
    Sistema->>Fila: Obter próximo ItemFila
    Fila-->>Sistema: ItemFila seleccionado
    note right of Fila: Seleção baseada em prioridade e estado

    %% Atualização do estado do ItemFila
    Sistema->>ItemFila: Atualizar estado para "em atendimento"
    ItemFila-->>Sistema: Estado atualizado
    note right of ItemFila: Item deixa de estar disponível na fila

    %% Criação do atendimento
    Sistema->>Atendimento: Criar Atendimento
    Atendimento-->>Sistema: Atendimento criado
    note right of Atendimento: Início formal do atendimento ao utente

    %% Registo da chamada
    Sistema->>ChamadaFila: Registar chamada
    ChamadaFila-->>Sistema: Chamada registada
    note right of ChamadaFila: Associação entre operador, utente e momento da chamada

    %% Atualização da fila
    Sistema->>Fila: Atualizar fila
    note right of Fila: Reorganização após remoção do item

    %% Registo de auditoria
    Sistema->>RegistoAuditoria: Registar chamada de utente
    RegistoAuditoria-->>Sistema: Registo concluído
    note right of RegistoAuditoria: Histórico da operação RF03

    %% Confirmação final
    Sistema-->>Operador: Chamada confirmada
    note left of Sistema: Utente encaminhado para atendimento
