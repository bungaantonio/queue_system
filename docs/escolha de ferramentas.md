## 3.2.3 Escolha de Tecnologias e Ferramentas

Após a modelagem e definição da arquitetura, procedeu-se à seleção das tecnologias e ferramentas que compuseram o protótipo, com base nos requisitos funcionais (RF) e não funcionais (RNF) previamente identificados. As decisões buscaram assegurar **segurança, desempenho, robustez e facilidade de integração** entre componentes, além de atender às necessidades operacionais do sistema.

---

### 1. Dispositivo Biométrico

Para o cadastro e autenticação de utentes, adotou-se o **USB Fingerprint Scanner Live20R/SLK20R**, um dispositivo de captura de impressões digitais com design óptico avançado. Segundo a documentação do fornecedor, o scanner utiliza um sensor **CMOS de 2 megapixéis**, capaz de realizar **detecção de impressão viva (liveness detection)** e capturar imagens de alta qualidade em diferentes condições de dedo, favorecendo a precisão na captura de dados biométricos durante o protótipo (iSecus, n.d.).

O equipamento apresentou as seguintes características técnicas relevantes:

* **Qualidade da imagem**: 2 milhões de pixels CMOS — suficiente para criar templates biométricos estáveis (iSecus, n.d.).
* **Detecção de impressão viva**: inclusão de mecanismo para reduzir tentativas de fraude ou dados inválidos (iSecus, n.d.).
* **Compatibilidade de leitura**: desempenho consistente com dedos secos, húmidos ou ásperos (iSecus, n.d.).
* **Comunicação USB 2.0/1.1**: permitiu integração com o middleware executado em ambiente Windows para captura e envio dos dados (iSecus, n.d.).
* **Formatos de imagem suportados**: RAW, BMP e JPG, facilitando processamento e armazenamento (iSecus, n.d.).

> Esta escolha atendeu diretamente aos requisitos de **cadastro de utentes por impressão digital (RF01)** e às demandas de **segurança e integridade de dados biométricos (RNF01)**, garantindo confiabilidade operacional no contato físico com o terminal de atendimento.

**Figura 1** ilustra o dispositivo USB Fingerprint Scanner Live20R/SLK20R utilizado no protótipo.

---

### 2. Middleware

O middleware foi desenvolvido em **C#**, integrando-se nativamente com o dispositivo biométrico via APIs do SDK fornecido, garantindo captura e pré-processamento dos dados antes do envio ao backend. Essa camada também implementou mecanismos de validação de integridade e duplicidade, atendendo aos requisitos de **segurança (RNF01)** e **desempenho (RNF03)**.

---

### 3. Backend

O backend foi implementado em **Python**, utilizando o framework **FastAPI**. Essa escolha permitiu:

* Gerenciar a lógica de negócio, controle da fila e emissão de tickets (RF02-RF03).
* Registrar ações para auditoria e histórico (RF05).
* Suportar múltiplas conexões simultâneas e requisições assíncronas, atendendo aos requisitos de **disponibilidade e desempenho (RNF02, RNF03)**.

---

### 4. Frontend

O frontend foi desenvolvido em **React**, com duas interfaces principais:

* **React Admin**: administração, supervisão e geração de relatórios (RF04, RF05).
* **React Queue Display**: exibição em tempo real da fila para utentes, com notificações de chamadas (RF04, RF06).

As escolhas possibilitaram interfaces responsivas, atualização dinâmica de dados e fácil integração com o backend, atendendo **RF04** e **RNF03**.

---

### 5. Banco de Dados

O protótipo utilizou **uma base de dados relacional**, selecionada por:

* Garantir integridade e consistência das informações (RF01-RF06).
* Permitir auditoria detalhada e exportação de relatórios (RF05).
* Suportar backups periódicos e restauração em caso de falhas (RNF05).

---

### 6. Integração Geral

A integração entre todos os componentes — hardware biométrico, middleware, backend, frontend e banco de dados — foi planejada para garantir:

* **Fluxo contínuo de dados** desde a captura da impressão até o registro e visualização no sistema.
* **Segurança e rastreabilidade** em cada etapa, com registros de auditoria vinculados a cada interação crítica (RF05).
* **Desempenho e disponibilidade** dos serviços em tempo real (RNF02, RNF03).

**Tabela 3.2.3‑1** resume as tecnologias escolhidas, suas funções e os requisitos atendidos:

| Componente     | Tecnologia                             | Responsabilidade               | RF/RNF atendidos         |
| -------------- | -------------------------------------- | ------------------------------ | ------------------------ |
| Biométrico     | USB Fingerprint Scanner Live20R/SLK20R | Captura de impressões digitais | RF01 / RNF01             |
| Middleware     | C#                                     | Pré‑processamento biométrico   | RF01‑RF02 / RNF01, RNF03 |
| Backend        | Python / FastAPI                       | Lógica de negócio e fila       | RF02‑RF05 / RNF02‑RNF04  |
| Frontend       | React (Admin e Queue Display)          | Interfaces de usuário          | RF04, RF06 / RNF03       |
| Banco de Dados | Relacional                             | Armazenamento e auditoria      | RF01‑RF06 / RNF05        |

**Figura 3** apresenta um **diagrama esquemático de integração** entre os componentes do protótipo.

---

### Referência

iSecus. (n.d.). *Fingerprint scanner SLK20R / Live20R* [Product page]. iSecus. Retrieved December 31, 2025, from [https://www.isecus.com/product/fingerprint-scanner-slk20r-live20r/](https://www.isecus.com/product/fingerprint-scanner-slk20r-live20r/)
