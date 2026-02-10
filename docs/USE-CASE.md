Perfeito. Vou apresentar os **casos de uso** do *Sistema de Gestão de Filas de Forma Segura* com o **nível clássico, académico e neutro**, adequado a monografia, **sem linguagem ágil**, e directamente derivado dos requisitos que já definiste.

Vou estruturar assim (forma canónica):

1. Visão geral dos casos de uso
2. Diagrama lógico (descrição textual)
3. Especificação textual dos casos de uso principais

---

## Casos de Uso do Sistema de Gestão de Filas de Forma Segura

### Visão Geral

Os casos de uso descrevem as interacções entre os actores e o sistema, evidenciando as funcionalidades disponibilizadas e os fluxos principais de operação. Estes casos de uso foram definidos a partir dos requisitos funcionais identificados, assegurando consistência e rastreabilidade.

### Actores Identificados

* **Utente** – Pessoa que solicita atendimento e aguarda na fila.
* **Operador** – Responsável pelo registo do utente e pela chamada para atendimento.
* **Administrador** – Responsável pela monitorização e gestão global da fila.
* **Auditor** – Responsável pela análise do histórico e das operações do sistema.
* **Sistema** – Actor secundário, responsável por automatismos internos.

---

## Lista de Casos de Uso

| Código | Caso de Uso                     | Actor Principal |
| ------ | ------------------------------- | --------------- |
| UC01   | Registar Utente                 | Operador        |
| UC02   | Inserir Utente na Fila          | Sistema         |
| UC03   | Chamar Utente para Atendimento  | Operador        |
| UC04   | Monitorizar Fila em Tempo Real  | Administrador   |
| UC05   | Consultar Histórico e Auditoria | Auditor         |

---

## UC01 – Registar Utente

**Actor principal:** Operador
**Actores secundários:** Utente
**Descrição:** Permite o registo de um utente no sistema, garantindo a sua identificação única.

**Pré-condições:**

* O operador encontra-se autenticado no sistema.

**Fluxo principal:**

1. O operador inicia o processo de registo.
2. O sistema solicita os dados de identificação do utente.
3. O operador introduz os dados ou realiza a leitura biométrica.
4. O sistema valida a inexistência de registos duplicados.
5. O sistema cria o registo do utente.
6. A operação é registada no histórico do sistema.

**Fluxos alternativos:**

* 4a. Caso seja detectado um registo duplicado, o sistema informa o operador e o processo é interrompido.

**Pós-condições:**

* O utente encontra-se registado e apto a ser inserido na fila.

**Requisitos associados:** RF01

---

## UC02 – Inserir Utente na Fila

**Actor principal:** Sistema
**Descrição:** Insere automaticamente o utente na fila de atendimento após o registo ou identificação.

**Pré-condições:**

* O utente encontra-se registado no sistema.

**Fluxo principal:**

1. O sistema calcula a prioridade do utente.
2. O sistema atribui uma pontuação de prioridade.
3. O sistema insere o utente na posição correspondente da fila.
4. A inserção é registada no histórico.

**Pós-condições:**

* O utente encontra-se posicionado na fila de atendimento.

**Requisitos associados:** RF02

---

## UC03 – Chamar Utente para Atendimento

**Actor principal:** Operador
**Descrição:** Permite a chamada do próximo utente a ser atendido, de acordo com a prioridade definida.

**Pré-condições:**

* Existe pelo menos um utente na fila.
* O operador encontra-se autenticado.

**Fluxo principal:**

1. O operador solicita a chamada do próximo utente.
2. O sistema identifica o utente com maior prioridade.
3. O sistema emite a chamada.
4. A chamada é registada no histórico.

**Fluxos alternativos:**

* 3a. O operador adia a chamada, indicando o motivo.

**Pós-condições:**

* O utente é chamado ou a chamada é adiada com registo.

**Requisitos associados:** RF03

---

## UC04 – Monitorizar Fila em Tempo Real

**Actor principal:** Administrador
**Descrição:** Permite a visualização do estado da fila e das métricas de atendimento.

**Pré-condições:**

* O administrador encontra-se autenticado.

**Fluxo principal:**

1. O administrador acede à interface de monitorização.
2. O sistema apresenta a fila actualizada.
3. O administrador aplica filtros ou consulta estatísticas.
4. O sistema apresenta os dados solicitados.

**Pós-condições:**

* Informação actualizada da fila é disponibilizada.

**Requisitos associados:** RF04

---

## UC05 – Consultar Histórico e Auditoria

**Actor principal:** Auditor
**Descrição:** Permite a consulta do histórico de operações para efeitos de auditoria.

**Pré-condições:**

* O auditor encontra-se autenticado e autorizado.

**Fluxo principal:**

1. O auditor acede ao módulo de auditoria.
2. O sistema apresenta o histórico de operações.
3. O auditor aplica filtros ou exporta relatórios.
4. O sistema disponibiliza a informação solicitada.

**Pós-condições:**

* Os dados de auditoria são consultados ou exportados.

**Requisitos associados:** RF05

---

### Observação final (importante para a monografia)

Este nível de detalhe é **suficiente e adequado** para:

* demonstrar rastreabilidade,
* suportar a implementação de um protótipo,
* e servir de base para diagramas UML (casos de uso ou actividades).

Se quiseres, no próximo passo posso:

* desenhar o **diagrama UML de casos de uso (descrição textual pronta para figura)**, ou
* derivar **diagramas de actividades** a partir destes casos de uso.

Diz-me como preferes continuar.
