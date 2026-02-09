---
config:
  theme: neo
---
sequenceDiagram
    autonumber
    participant Administrador
    participant Sistema
    participant ItemFila
    participant Fila

    %% Pedido de monitorização
    Administrador->>Sistema: Visualizar fila
    note right of Administrador: Pedido de visão global da fila

    %% Sistema obtém os itens da fila
    Sistema->>Fila: Obter lista de ItemFila
    Fila-->>Sistema: Lista de ItemFila
    note right of Fila: Estado actual da fila (read-only)

    %% Sistema consulta estado detalhado dos itens
    Sistema->>ItemFila: Obter estado dos ItemFila
    ItemFila-->>Sistema: Estados dos ItemFila
    note right of ItemFila: Estado, prioridade, tempo de espera

    %% Processamento da informação
    Sistema->>Sistema: Agregar e aplicar filtros
    note right of Sistema: Prioridade, tempo, estado, ordenação

    %% Retorno dos dados
    Sistema-->>Administrador: Dados processados da fila
    note left of Sistema: Informação consolidada para monitorização
