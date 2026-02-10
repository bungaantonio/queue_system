## 3.2.4 Etapas de Desenvolvimento

O desenvolvimento do protótipo seguiu uma abordagem **iterativa e incremental**, permitindo que cada módulo fosse projetado, implementado, testado e ajustado de forma independente. As etapas foram conduzidas em sequência lógica, garantindo que os requisitos funcionais e não funcionais fossem atendidos, e assegurando rastreabilidade, auditabilidade e replicabilidade.

---

### 1. Configuração do Ambiente de Desenvolvimento

O primeiro passo consistiu na preparação dos ambientes de desenvolvimento e teste:

* Instalação e configuração dos drivers do **USB Fingerprint Scanner Live20R/SLK20R**.
* Configuração do ambiente **C# para middleware**, incluindo bibliotecas para integração com o scanner.
* Implementação do ambiente **Python/FastAPI** para backend e **React** para frontend.
* Preparação do banco de dados relacional e definição do esquema inicial.

> Esta etapa permitiu validar a compatibilidade entre hardware, middleware e backend, reduzindo problemas de integração futuros.

---

### 2. Desenvolvimento do Middleware

O middleware foi desenvolvido como a primeira camada funcional:

* Implementou a captura de dados biométricos e pré-processamento.
* Validou duplicidade e integridade das impressões digitais.
* Convertia os dados em JSON para envio ao backend.

> Testes unitários foram realizados nesta etapa para garantir que todas as leituras fossem consistentes e que dados inválidos fossem rejeitados, cumprindo RNF01 e RNF03.

---

### 3. Desenvolvimento do Backend

O backend foi construído paralelamente à camada de middleware:

* Criação de APIs para gerenciamento de fila, emissão de tickets e controle de prioridade (RF02, RF03).
* Implementação do registro de auditoria e histórico de ações (RF05).
* Integração com middleware e banco de dados, garantindo que dados biométricos fossem corretamente armazenados e associados aos utentes.

> Testes de integração validaram que o backend recebia corretamente os dados do middleware e que todas as operações eram registradas no banco de dados.

---

### 4. Desenvolvimento do Frontend

O frontend foi desenvolvido para atender tanto operadores quanto utentes:

* **React Admin**: interfaces administrativas e relatórios, incluindo filtros e exportação de dados (RF04, RF05).
* **React Queue Display**: exibição da fila em tempo real, notificações de chamadas e status de atendimento (RF04, RF06).

> Foram realizados testes de usabilidade com operadores e simulações de fila, garantindo que informações críticas fossem exibidas corretamente e com atraso mínimo (RNF03, RNF04).

---

### 5. Integração Completa

Após o desenvolvimento individual de cada camada, procedeu-se à **integração total do sistema**:

* Fluxo de dados: **dispositivo biométrico → middleware → backend → banco → frontend**.
* Verificação da consistência de dados e rastreabilidade de todas as operações.
* Ajustes de performance e testes de carga para assegurar alta disponibilidade e tempos de resposta dentro do esperado (RNF02, RNF03).

> Esta etapa permitiu validar a comunicação entre todos os componentes do protótipo e a correta aplicação das regras de negócio definidas nos requisitos.

---

### 6. Testes e Validação

Ao longo do desenvolvimento, foram realizadas **rodadas de testes iterativos**:

* **Testes unitários** em cada módulo.
* **Testes de integração** entre middleware, backend e frontend.
* **Testes de desempenho e carga**, simulando múltiplos utentes simultâneos.
* **Testes de auditoria e segurança**, garantindo que apenas usuários autorizados acessassem dados sensíveis (RNF01, RNF05).

> Os testes confirmaram que o protótipo atendia aos requisitos funcionais e não funcionais, garantindo confiabilidade, rastreabilidade e desempenho esperado.

---

### 7. Documentação

Ao longo do desenvolvimento, foram produzidos artefatos de documentação:

* Diagramas de classe, sequência e arquitetura.
* Tabelas de rastreabilidade RF → RNF.
* Guias de instalação, configuração e operação do protótipo.

> Esta documentação assegurou que o protótipo pudesse ser **replicado e mantido** em futuras implementações.

---

## Diagrama resumido de etapas de desenvolvimento


| Etapa                         | Nível do Processo           | Tecnologias/Ferramentas                                     | RF/RNF atendidos          | Observações                                                                        |
| ----------------------------- | --------------------------- | ----------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| Configuração do ambiente      | Preparação / Infraestrutura | C#, Python, React, Banco Relacional, Scanner Live20R/SLK20R | Todos os RF/RNF iniciais  | Instalação de drivers, setup de ambientes e testes iniciais de compatibilidade     |
| Desenvolvimento do Middleware | Construção de componente    | C#                                                          | RF01, RF02 / RNF01, RNF03 | Captura biométrica, validação e conversão JSON                                     |
| Desenvolvimento do Backend    | Construção de componente    | Python / FastAPI                                            | RF02-RF05 / RNF02-RNF04   | Gerenciamento da fila, emissão de tickets, auditoria                               |
| Desenvolvimento do Frontend   | Construção de componente    | React (Admin e Queue Display)                               | RF04, RF06 / RNF03        | Interfaces dinâmicas e visualização em tempo real                                  |
| Integração Completa           | Integração de sistemas      | Todas as tecnologias anteriores                             | Todos os RF/RNF           | Fluxo de dados do dispositivo até o frontend, testes de comunicação e consistência |
| Testes e Validação            | Verificação e validação     | Ferramentas de teste unitário e integração                  | Todos os RF/RNF           | Testes de desempenho, carga, auditoria e segurança                                 |
| Documentação                  | Registro e rastreabilidade  | Diagramas UML, tabelas de rastreabilidade                   | Todos os RF/RNF           | Guias de operação, instalação e manutenção                                         |



