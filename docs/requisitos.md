# REQUISITOS

## 1. Requisitos Funcionais (RF)

**RF01** – Cadastro de Utente

*Ator principal*: Operador

O sistema deve permitir o registro de utentes sem cadastro prévio, assegurando identificação única e posterior inserção na fila de atendimento.

**Critérios de verificação**:

+ O registro será realizado via leitura biométrica ou introdução de dados básicos (nome, data de nascimento, telefone);
+ O sistema validará duplicidades, prevenindo cadastros repetidos;
+ O cadastro será registrado no histórico do sistema.

**RNFs associados**: RNF01, RNF02

**RF02** – Inserção Automática na Fila

*Ator principal*: Sistema

Após cadastro ou identificação, o sistema deve inserir automaticamente o utente na fila, aplicando critérios de priorização definidos.

**Critérios de verificação**:

+ A prioridade será calculada com base em idade, urgência e prioridade administrativa ou médica;
+ A posição do utente na fila será atualizada em tempo real;
+ O registro da posição será armazenado no histórico do sistema.

**RNFs associados**: RNF02, RNF03

**RF03** – Chamada de Utentes

*Ator principal*: Operador

O sistema deve permitir a chamada do próximo utente, seguindo a ordem de prioridade.

*Critérios de verificação*:

+ O utente chamado será aquele com maior pontuação disponível;
+ Chamadas poderão ser adiadas ou remarcadas, registrando-se o motivo;
+ A chamada será comunicada via display ou notificação digital.

*RNFs associados*: RNF02, RNF03

**RF04** – Monitorização da Fila em Tempo Real

*Ator principal*: Administrador

O sistema deve disponibilizar visualização em tempo real da fila, permitindo acompanhamento da ordem, tempos de espera e estatísticas.

**Critérios de verificação**:

+ Alterações na fila serão refletidas com atraso mínimo;
+ Filtros por prioridade, tipo de atendimento e tempo de espera estarão disponíveis;
+ Informações resumidas poderão ser exportadas para análise.

**RNFs associados**: RNF02, RNF03, RNF04

**RF05** – Auditoria e Histórico de Ações

*Ator principal*: Auditor

O sistema deve manter registro completo das ações realizadas.

**Critérios de verificação**:

+ Histórico incluirá cadastro, alterações de prioridade, chamadas e cancelamentos;
+ Acesso será restrito a perfis autorizados;
+ Relatórios poderão ser exportados para auditoria.

**RNFs associados**: RNF01, RNF03, RNF05

**RF06** – Consulta da Fila

*Ator principal*: Utente / Operador

O sistema deve permitir que utentes e operadores consultem a posição e o estado na fila, garantindo visibilidade clara e atualização em tempo real.

*Critérios de verificação*:

+ A consulta permitirá visualizar a posição atual na fila e o estado do atendimento (aguardando, em chamada, atendido ou cancelado);
+ O acesso à informação será restrito aos dados do próprio utente ou a perfis autorizados, mediante identificação segura;
+ As informações apresentadas refletirão o estado mais recente da fila, com atraso mínimo;
+ A operação de consulta será registrada no histórico do sistema.

**RNFs associados**: RNF01, RNF02, RNF03

## 2. Requisitos Não Funcionais (RNF)

**RNF01** – Segurança
O sistema deve garantir confidencialidade e integridade dos dados, com acesso restrito a utilizadores autorizados.\
*RFs afetados*: RF01, RF05\
*Critério de verificação*: testes de acesso não autorizado e validação de criptografia AES-256

**RNF02** – Disponibilidade
O sistema deve apresentar alta disponibilidade, sem interrupções superiores a 5 segundos.\
*RFs afetados*: RF01, RF02, RF03, RF04\
*Critério de verificação*: monitorização contínua de uptime e alertas em caso de indisponibilidade

**RNF03** – Desempenho
O tempo de resposta para operações críticas deve ser inferior a 2 segundos.\
*RFs afetados*: RF02, RF03, RF04, RF05\
*Critério de verificação*: testes de carga simulando múltiplos utentes simultâneos

**RNF04** – Escalabilidade
O sistema deve suportar aumento significativo do número de utentes simultâneos sem degradação perceptível de desempenho.\
*RFs afetados*: RF04\
*Critério de verificação*: testes de stress e análise de tempos de resposta

**RNF05** – Backup e Recuperação
O sistema deve assegurar backups periódicos e recuperação integral em tempo aceitável.
**RFs afetados**: RF05\
*Critério de verificação*: simulação de falha e restauração completa

## 3. Matriz de Rastreabilidade (RF → RNF)

| Requisito Funcional          | Requisitos Não Funcionais Associados |
| ---------------------------- | ------------------------------------ |
| RF01 – Cadastro de Utente    | RNF01, RNF02                         |
| RF02 – Inserção na Fila      | RNF02, RNF03                         |
| RF03 – Chamada de Utentes    | RNF02, RNF03                         |
| RF04 – Monitorização da Fila em Tempo Real | RNF02, RNF03, RNF04                  |
| RF05 – Auditoria e Histórico de Ações | RNF01, RNF03, RNF05                  |
|RF06 – Consulta da Fila       | RNF01, RNF02, RNF03