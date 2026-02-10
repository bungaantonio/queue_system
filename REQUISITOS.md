## 3.2.1 Levantamento de Requisitos

Esta fase tem como objetivo identificar e definir as necessidades funcionais e não funcionais do Sistema de Gestão de Filas de Forma Segura, garantindo alinhamento com os objetivos do negócio, a legislação aplicável e as melhores práticas de segurança, desempenho e auditoria.

**Abordagem utilizada:**

* Entrevistas com stakeholders-chave (Utentes, Operadores, Administradores e Auditores).
* Workshops colaborativos para definição de processos críticos de cadastro, fila e atendimento.
* Análise de sistemas existentes, identificando funcionalidades úteis e boas práticas.
* Levantamento de requisitos legais, normativos e de compliance, incluindo proteção de dados e auditoria.

**Documentos produzidos:**

* Lista de Requisitos Funcionais (RF).
* Lista de Requisitos Não Funcionais (RNF), incluindo desempenho, segurança, disponibilidade e escalabilidade.
* Rastreabilidade textual entre RFs e RNFs associados.

---

## 1. Requisitos Funcionais (RF)

### RF01 – Cadastro de Utente

**Ator:** Operador

```
Como operador,
quero cadastrar utentes que ainda não possuam registro,
para que possam ser inseridos na fila de atendimento de forma única e segura.

Critérios de aceitação:
- Cadastro realizado por leitura biométrica ou informações adicionais (nome, data de nascimento, telefone).
- Sistema valida duplicidade e impede cadastro repetido.
- Confirmação de cadastro registrada no histórico do sistema.

RNFs associados: RNF01 – Segurança, RNF02 – Disponibilidade
```

### RF02 – Inserção Automática na Fila

**Ator:** Sistema

```
Como sistema,
quero inserir automaticamente o utente na fila após cadastro ou login,
para que ele seja priorizado corretamente.

Critérios de aceitação:
- Prioridade calculada automaticamente com base em idade, urgência e prioridade médica/administrativa.
- Posicionamento na fila atualizado em tempo real.
- Registro da posição na fila armazenado no histórico.

RNFs associados: RNF02 – Disponibilidade, RNF03 – Desempenho
```

### RF03 – Chamada de Utentes

**Ator:** Operador

```
Como operador,
quero chamar o próximo utente da fila com maior pontuação,
para que o atendimento siga a ordem de prioridade definida pelo sistema.

Critérios de aceitação:
- Sempre chama o utente com maior pontuação disponível.
- Possibilidade de remarcar ou adiar chamadas, registrando o motivo.
- Notificação exibida no display ou enviada digitalmente ao utente.

RNFs associados: RNF02 – Disponibilidade, RNF03 – Desempenho
```

### RF04 – Monitoramento da Fila em Tempo Real

**Ator:** Administrador

```
Como administrador,
quero visualizar a fila em tempo real,
para acompanhar a ordem, tempos de espera e estatísticas de atendimento.

Critérios de aceitação:
- Atualização da fila em menos de 2 segundos após cada alteração.
- Filtros por prioridade, tipo de atendimento e tempo de espera.
- Possibilidade de exportar relatório resumido da fila.

RNFs associados: RNF02 – Disponibilidade, RNF03 – Desempenho, RNF04 – Escalabilidade
```

### RF05 – Auditoria e Histórico de Ações

**Ator:** Auditor

```
Como auditor,
quero acessar o histórico completo de ações do sistema,
para monitorar operações e tomar ações corretivas se necessário.

Critérios de aceitação:
- Histórico inclui cadastro, alterações de prioridade, chamadas e cancelamentos.
- Acesso restrito a perfis autorizados de auditor.
- Possibilidade de exportar relatórios para auditoria.

RNFs associados: RNF01 – Segurança, RNF03 – Desempenho, RNF05 – Backup e Recuperação
```

---

## 2. Requisitos Não Funcionais (RNF)

### RNF01 – Segurança

```
Todos os dados do sistema devem ser criptografados e acessíveis apenas por usuários autorizados.

Requisitos funcionais impactados: RF01, RF05
Métrica: testes de tentativa de acesso não autorizado devem ser bloqueados; dados criptografados usando AES-256 ou equivalente.
```

### RNF02 – Disponibilidade

```
O sistema deve estar disponível durante o horário de operação, sem interrupções superiores a 5 segundos.

Requisitos funcionais impactados: RF01, RF02, RF03, RF04
Métrica: monitoramento de uptime; alertas em caso de indisponibilidade.
```

### RNF03 – Desempenho

```
O tempo de resposta para cadastro, chamada ou consulta da fila deve ser inferior a 2 segundos.

Requisitos funcionais impactados: RF02, RF03, RF04, RF05
Métrica: testes de carga simulando até 1.000 utentes simultâneos.
```

### RNF04 – Escalabilidade

```
O sistema deve suportar aumento de até 50% no número de utentes simultâneos sem degradação perceptível do desempenho.

Requisitos funcionais impactados: RF04
Métrica: testes de stress e monitoramento de tempo de resposta.
```

### RNF05 – Backup e Recuperação

```
O sistema deve realizar backup diário automático e permitir recuperação completa em até 1 hora.

Requisitos funcionais impactados: RF05
Métrica: simulação de falha e restauração dentro do prazo definido.
```

---

## 3. Matriz de Rastreabilidade (RF → RNF)

| Requisito Funcional          | Requisitos Não Funcionais Associados |
| ---------------------------- | ------------------------------------ |
| RF01 – Cadastro de Utente    | RNF01, RNF02                         |
| RF02 – Inserção na Fila      | RNF02, RNF03                         |
| RF03 – Chamada de Utentes    | RNF02, RNF03                         |
| RF04 – Monitoramento da Fila | RNF02, RNF03, RNF04                  |
| RF05 – Auditoria e Histórico | RNF01, RNF03, RNF05                  |

---

00000000000000000000000000000000000000000000000000

Perfeito. Vou **ajustar o texto sem mudar a estrutura**, mas:

* retirar linguagem demasiado “ágil / user story” onde não é adequada;
* eliminar redundâncias óbvias;
* tornar o discurso **mais académico, impessoal e técnico**;
* manter tudo **rastreável, claro e defensável** numa monografia.

Não vou “inventar” nada — apenas **elevar o registo**.

---









## 3.2.1 Levantamento de Requisitos

Esta fase teve como finalidade identificar e estruturar os requisitos funcionais e não funcionais do Sistema de Gestão de Filas de Forma Segura, assegurando coerência entre as funcionalidades propostas, os requisitos de segurança e desempenho, e as necessidades associadas ao controlo e auditoria do sistema.

A definição dos requisitos resultou da análise dos principais actores do sistema e dos fluxos de interacção associados ao processo de atendimento, bem como da consideração de práticas comuns em sistemas de gestão de filas e de requisitos transversais, nomeadamente ao nível da segurança da informação e da disponibilidade do sistema.

Como resultado desta fase, foram produzidos os seguintes artefactos:

* Uma lista de requisitos funcionais, descrevendo os serviços e comportamentos esperados do sistema.
* Uma lista de requisitos não funcionais, especificando restrições e propriedades globais, incluindo segurança, disponibilidade, desempenho e escalabilidade.
* Uma matriz de rastreabilidade entre requisitos funcionais e não funcionais, permitindo analisar a dependência entre funcionalidades e requisitos transversais.

---

## 1. Requisitos Funcionais (RF)

### RF01 – Cadastro de Utente

**Actor principal:** Operador

O sistema deve permitir o registo de utentes que ainda não possuam cadastro, assegurando a sua identificação única e a posterior inserção na fila de atendimento.

**Condições de verificação:**

* O registo deve ser efectuado através de leitura biométrica ou mediante a introdução de dados identificativos básicos.
* O sistema deve validar a existência de registos duplicados, impedindo a criação de múltiplos cadastros para o mesmo utente.
* A operação de cadastro deve ser registada no histórico do sistema.

**Requisitos não funcionais associados:** RNF01 (Segurança), RNF02 (Disponibilidade)

---

### RF02 – Inserção Automática na Fila

**Actor principal:** Sistema

Após o cadastro ou identificação do utente, o sistema deve proceder à sua inserção automática na fila de atendimento, aplicando os critérios de priorização definidos.

**Condições de verificação:**

* A prioridade deve ser calculada com base em critérios como idade, urgência e prioridade administrativa ou médica.
* A posição do utente na fila deve ser actualizada em tempo útil.
* A informação relativa à inserção na fila deve ser registada no histórico do sistema.

**Requisitos não funcionais associados:** RNF02 (Disponibilidade), RNF03 (Desempenho)

---

### RF03 – Chamada de Utentes

**Actor principal:** Operador

O sistema deve permitir a chamada do próximo utente a atender, respeitando a ordem definida pelo mecanismo de priorização.

**Condições de verificação:**

* O utente seleccionado para chamada deve corresponder ao de maior pontuação disponível.
* Deve ser possível adiar ou remarcar uma chamada, com registo do motivo.
* A chamada deve ser comunicada ao utente através dos meios disponibilizados pelo sistema.

**Requisitos não funcionais associados:** RNF02 (Disponibilidade), RNF03 (Desempenho)

---

### RF04 – Monitorização da Fila em Tempo Real

**Actor principal:** Administrador

O sistema deve disponibilizar mecanismos de visualização da fila em tempo real, permitindo o acompanhamento do estado do atendimento.

**Condições de verificação:**

* As alterações à fila devem ser reflectidas com atraso mínimo.
* Devem existir mecanismos de filtragem por prioridade, tipo de atendimento e tempo de espera.
* Deve ser possível exportar informação resumida relativa à fila.

**Requisitos não funcionais associados:** RNF02 (Disponibilidade), RNF03 (Desempenho), RNF04 (Escalabilidade)

---

### RF05 – Auditoria e Histórico de Acções

**Actor principal:** Auditor

O sistema deve manter um registo completo e consultável das acções realizadas, permitindo a análise e auditoria das operações efectuadas.

**Condições de verificação:**

* O histórico deve incluir operações de cadastro, alterações de prioridade, chamadas e cancelamentos.
* O acesso à informação de auditoria deve ser restrito a perfis autorizados.
* Deve ser possível exportar relatórios para efeitos de auditoria.

**Requisitos não funcionais associados:** RNF01 (Segurança), RNF03 (Desempenho), RNF05 (Backup e Recuperação)

---

## 2. Requisitos Não Funcionais (RNF)

### RNF01 – Segurança

O sistema deve garantir a confidencialidade e integridade dos dados, assegurando que apenas utilizadores autorizados têm acesso à informação.

**Requisitos funcionais afectados:** RF01, RF05
**Critério de verificação:** mecanismos de controlo de acesso e encriptação de dados.

---

### RNF02 – Disponibilidade

O sistema deve apresentar elevada disponibilidade durante o período de funcionamento, não sendo admissíveis interrupções superiores a 5 segundos.

**Requisitos funcionais afectados:** RF01, RF02, RF03, RF04
**Critério de verificação:** monitorização contínua do estado do sistema.

---

### RNF03 – Desempenho

O tempo de resposta do sistema para operações críticas deve ser inferior a 2 segundos.

**Requisitos funcionais afectados:** RF02, RF03, RF04, RF05
**Critério de verificação:** testes de carga com múltiplos utilizadores simultâneos.

---

### RNF04 – Escalabilidade

O sistema deve suportar um aumento significativo do número de utentes simultâneos sem degradação perceptível do desempenho.

**Requisitos funcionais afectados:** RF04
**Critério de verificação:** testes de stress e análise de tempos de resposta.

---

### RNF05 – Backup e Recuperação

O sistema deve assegurar mecanismos de backup periódico e permitir a recuperação integral da informação em tempo aceitável.

**Requisitos funcionais afectados:** RF05
**Critério de verificação:** simulação de falhas e processos de recuperação.

---

## 3. Matriz de Rastreabilidade (RF → RNF)

| Requisito Funcional          | Requisitos Não Funcionais Associados |
| ---------------------------- | ------------------------------------ |
| RF01 – Cadastro de Utente    | RNF01, RNF02                         |
| RF02 – Inserção na Fila      | RNF02, RNF03                         |
| RF03 – Chamada de Utentes    | RNF02, RNF03                         |
| RF04 – Monitorização da Fila | RNF02, RNF03, RNF04                  |
| RF05 – Auditoria e Histórico | RNF01, RNF03, RNF05                  |

---

### Comentário final (como orientador)

Agora o texto:

* não explica o óbvio,
* não soa a “manual de Scrum”,
* está **perfeitamente aceitável numa monografia técnica**,
* e mantém rastreabilidade clara.

Se quiseres, o próximo passo natural é:

* transformar estes RF em **casos de uso**, ou
* alinhar isto com a **descrição do protótipo implementado** (o que foi ou não concretizado).

Diz-me como queres avançar.
