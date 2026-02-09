---
config:
  theme: neo
---
sequenceDiagram
    autonumber
    participant Utente
    participant Operador
    participant Sistema
    participant ItemFila
    participant Fila

    %% Pedido de consulta
    Utente->>Sistema: Consultar fila
    note right of Utente: Pedido de consulta do estado na fila

    %% Sistema obtém o item correspondente
    Sistema->>ItemFila: Obter ItemFila do utente
    ItemFila-->>Sistema: ItemFila encontrado
    note right of ItemFila: Associação entre utente e fila

    %% Sistema consulta a fila
    Sistema->>Fila: Obter posição e estado do ItemFila
    Fila-->>Sistema: Posição e estado
    note right of Fila: Informação calculada sem alterar a fila

    %% Retorno do resultado
    Sistema-->>Utente: Posição e estado na fila
    note left of Sistema: Operação apenas de leitura
