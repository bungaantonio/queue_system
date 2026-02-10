Perfeito! Vou criar uma **versão enriquecida de 3.2.2**, mantendo **tom narrativo em passado**, mas incluindo **esquemas textuais de diagramas UML**, detalhando fluxos, entidades e interações, e ligando **cada artefato aos RFs/RNFs**. Isso deixará a seção **mais viva, técnica e pronta para avaliação acadêmica de alto nível**.

---

## 3.2.2 Modelagem e Projeto de Arquitetura do Sistema

Após o levantamento de requisitos, iniciou-se a fase de modelagem e projeto da arquitetura do sistema, com o objetivo de transformar os requisitos funcionais e não funcionais em representações formais, como diagramas e modelos conceituais, que servissem de guia para a implementação. Essa etapa seguiu práticas consolidadas de engenharia de software, incluindo técnicas de modelagem arquitetural, definição de componentes, interfaces e fluxos de dados, garantindo rastreabilidade, modularidade, manutenibilidade e segurança ao sistema.

---

### 1. Modelagem do Sistema

A modelagem foi conduzida em três níveis principais: **casos de uso**, **diagrama de classes** e **diagramas de sequência**, cada um deles construído para assegurar que os requisitos fossem plenamente contemplados.

#### 1.1 Casos de Uso

Foram definidos casos de uso para mapear **atores, funcionalidades e fluxos críticos**. Os casos de uso foram diretamente associados aos RFs identificados:

* **Atores**: Utente, Operador, Administrador, Auditor, Sistema biométrico.
* **Casos de uso e RFs correspondentes**:

| Caso de Uso           | RF Correspondente | Descrição                                                                                                        |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Cadastro de Utente    | RF01              | Permitiu registrar utentes com identificação biométrica ou dados básicos, validando duplicidades.                |
| Inserção na Fila      | RF02              | Inseriu automaticamente o utente na fila, calculando prioridade por idade, urgência e critérios administrativos. |
| Chamada de Utentes    | RF03              | Chamou utentes segundo ordem de prioridade, registrando chamadas e eventuais adiamentos.                         |
| Monitorização da Fila | RF04              | Visualizou a fila em tempo real, apresentando tempos de espera e filtros por prioridade.                         |
| Auditoria e Histórico | RF05              | Registrou todas as ações, permitindo consultas e geração de relatórios auditáveis.                               |
| Consulta da Fila      | RF06              | Permitindo utentes e operadores visualizarem posição e estado atual na fila.                                     |

**Esquema textual do diagrama de casos de uso**:

```
[Utente] --------> (Consulta da Fila)
[Operador] ------> (Chamada de Utentes)
[Operador] ------> (Cadastro de Utente)
[Administrador] --> (Monitorização da Fila)
[Auditor] ------> (Auditoria e Histórico)
[Sistema biométrico] --> (Cadastro de Utente)
(Sistema) <------ (Inserção na Fila)
```

---

#### 1.2 Diagrama de Classes

O diagrama de classes foi construído para representar **entidades, atributos e relacionamentos**, garantindo coerência estrutural com os RFs:

* **Entidades principais**: Utente, Ticket, Fila, Operador, Auditoria.
* **Relacionamentos**:

  * Fila **agrega** Tickets (1:N)
  * Operador **interage** com Fila para chamadas
  * Auditoria **registra** ações de Utentes e Operadores

**Esquema textual do diagrama de classes**:

```
Classe Utente
  - idUtente
  - nome
  - dataNascimento
  - telefone
  + registrar()
  + atualizarDados()

Classe Ticket
  - idTicket
  - prioridade
  - timestamp
  + gerar()
  + atualizarPrioridade()

Classe Fila
  - tickets[]
  + adicionarTicket()
  + removerTicket()
  + consultarPosicao()

Classe Operador
  - idOperador
  - credenciais
  + chamarUtente()
  + alterarPrioridade()

Classe Auditoria
  - idAcao
  - timestamp
  - descricaoAcao
  + registrarAcao()
  + gerarRelatorio()
```

Cada método e atributo foi definido para atender RFs específicos e garantir que as RNFs de segurança, desempenho e auditabilidade fossem contempladas.

---

#### 1.3 Diagramas de Sequência

Foram elaborados diagramas de sequência para **representar interações dinâmicas** entre objetos nos fluxos principais:

* **Fluxo de cadastro e inserção na fila (RF01 + RF02)**:

```
Utente -> Middleware: enviarDadosBiometricos()
Middleware -> Backend: validarEConverterJSON()
Backend -> BaseDados: registrarUtente()
Backend -> Fila: inserirTicket()
Fila -> Frontend: atualizarFila()
```

* **Fluxo de chamada de utentes (RF03)**:

```
Operador -> Backend: solicitarProximoUtente()
Backend -> Fila: obterTicketPrioritario()
Fila -> Operador: retornarTicket()
Backend -> Auditoria: registrarChamada()
```

* **Fluxo de auditoria (RF05)**:

```
Operador/Utente -> Sistema: realizarAcao()
Sistema -> Auditoria: registrarAcao()
Auditoria -> BaseDados: salvarHistorico()
```

Cada diagrama considerou **fluxos alternativos** e cenários de exceção, como duplicidade de cadastro, falhas na leitura biométrica e adiamento de chamadas.

---

### 2. Projeto de Arquitetura

A arquitetura foi organizada em **três camadas**, assegurando separação de responsabilidades e atendimento aos RNFs de segurança, disponibilidade, desempenho e escalabilidade:

1. **Camada Middleware**: validou dados biométricos e preparou mensagens para o backend, assegurando integridade e consistência (RNF01, RNF03).
2. **Camada Backend**: implementou regras de negócio, gerenciou a fila e coordenou auditoria, garantindo alto desempenho e disponibilidade (RNF02, RNF03, RNF04).
3. **Camada Frontend**: forneceu interfaces para supervisão, administração e exibição da fila em tempo real (RF04, RF06), assegurando visibilidade e controle sobre o sistema.

**Esquema textual do diagrama de componentes**:

```
[Frontend]
  |-- React Admin
  |-- React Queue Display

[Backend]
  |-- API FastAPI
  |-- Gerenciamento de Fila
  |-- Auditoria

[Middleware]
  |-- Validação biométrica
  |-- Conversão JSON
```

As interações entre camadas foram projetadas para **garantir baixo acoplamento, modularidade e facilidade de manutenção**.

---

### 3. Design de Alto Nível

O design de alto nível consolidou as decisões de modelagem e arquitetura:

* **Fluxos de dados**: definidos para cada RF crítico, assegurando que informações fossem consistentes entre Middleware, Backend e Frontend.
* **Rastreabilidade**: todos os artefatos foram ligados aos RFs e RNFs correspondentes, permitindo auditoria e verificação de conformidade.
* **Modularidade e acoplamento**: módulos planejados para minimizar dependências, facilitando manutenção e testes unitários.
* **Segurança e auditabilidade**: todas as interações críticas registradas em logs, garantindo histórico completo de operações.

Este conjunto de modelagem e arquitetura **permitiu obter uma base sólida para a implementação**, assegurando que todos os requisitos funcionais e não funcionais fossem atendidos de forma consistente e verificável.

---

Se quiser, posso ainda criar **uma versão com diagramas UML mais “visuais” em ASCII ou pseudo-gráfico**, que poderia ser anexada como figura ao relatório, mantendo **rigor acadêmico e clareza narrativa**, como é exigido em submissões de Ph.D.

Queres que eu faça isso também?
