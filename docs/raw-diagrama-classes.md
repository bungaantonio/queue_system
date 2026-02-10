Perfeito! Vou fornecer **uma versão textual completa e organizada do diagrama de classes**, pronta para você transpor para qualquer ferramenta UML. Incluí **classes, atributos, métodos, relações e multiplicidades**, mantendo coerência com todos os RFs e casos de uso que você já definiu.

---

# **Diagrama de Classes – Versão Completa**

---

### **1. Utente**

* **Atributos**:

  * `idUtente: int`
  * `nome: string`
  * `dataNascimento: Date`
  * `telefone: string`
* **Relações**:

  * 1:N → `ItemFila`
  * 1:1 → `Biometria`
* **Métodos**:

  * `solicitarEntradaFila()`
  * `consultarPosicaoFila()`

---

### **2. Biometria**

* **Atributos**:

  * `tipo: string`
  * `hashBiometrico: string`
  * `dataRegistro: Date`
* **Relações**:

  * 1:1 → `Utente`

---

### **3. Fila**

* **Atributos**:

  * `idFila: int`
  * `tipoAtendimento: string`
  * `SLA: string`
* **Relações**:

  * 1:N → `ItemFila`
  * N:1 → `Operador` / `Administrador` (gerentes da fila)
* **Métodos**:

  * `validarPosicao(item: ItemFila)`

---

### **4. ItemFila**

* **Atributos**:

  * `idItem: int`
  * `status: string` (aguardando, chamado, atendido, cancelado)
  * `prioridade: int`
  * `horaEntrada: DateTime`
* **Relações**:

  * 1:1 → `Atendimento`
  * N:1 → `Utente`
  * N:1 → `Fila`
  * 0:N → `RegistroAuditoria` (opcional para histórico)
* **Métodos**:

  * `atualizarStatus()`
  * `calcularPrioridade()`

---

### **5. Atendimento**

* **Atributos**:

  * `horaChamada: DateTime`
  * `horaAtendimento: DateTime`
  * `status: string`
* **Relações**:

  * 1:1 → `ItemFila`
  * N:1 → `Operador`
* **Métodos**:

  * `registrarAtendimento()`

---

### **6. ChamadaFila**

* **Atributos**:

  * `idChamada: int`
  * `horaChamada: DateTime`
  * `motivoAdiado: string`
* **Relações**:

  * 1:N → `ItemFila`
  * N:1 → `Operador`
* **Métodos**:

  * `executarChamada()`

---

### **7. Operador**

* **Métodos**:

  * `atenderUtente(item: ItemFila)`
  * `promoverRebaixarPrioridade(item: ItemFila)`
  * `criarFila()` *(se permissões de administrador)*

---

### **8. Administrador**

* **Métodos**:

  * `criarFila()`
  * `configurarFila(SLA, regras)`

---

### **9. Auditor**

* **Métodos**:

  * `visualizarHistorico()`
  * `gerarRelatorioAuditoria()`

---

### **10. RegistroAuditoria**

* **Atributos**:

  * `acao: string`
  * `dataHora: DateTime`
  * `ator: string`
  * `entidadeAfetada: string`
  * `hash: string`
* **Relações**:

  * N:1 → `ItemFila` *(ou outras entidades auditáveis)*

---

### **Relações e Multiplicidades Resumidas**

| Relação                      | Multiplicidade |
| ---------------------------- | -------------- |
| Utente → ItemFila            | 1:N            |
| Utente → Biometria           | 1:1            |
| Fila → ItemFila              | 1:N            |
| ItemFila → Atendimento       | 1:1            |
| ItemFila → Fila              | N:1            |
| ItemFila → RegistroAuditoria | 0:N            |
| ChamadaFila → ItemFila       | 1:N            |
| Operador → Atendimento       | 1:N            |
| Operador → ChamadaFila       | 1:N            |
| Administrador → Fila         | 1:N            |

---

✅ **Observações finais:**

1. `VerificaFila` foi removida como classe; virou método de `Fila`.
2. Todos os métodos listados estão alinhados com os **RFs e UCs**.
3. Nenhuma classe desnecessária foi criada; todas refletem dados persistentes ou entidades do domínio.
4. Relações e multiplicidades foram ajustadas para **cenários reais de fila de atendimento**.

---

Se você quiser, posso criar **uma versão UML textual “ASCII”**, já desenhada de forma visual, pronta para usar como diagrama ou para exportar para Draw.io/StarUML.

Quer que eu faça isso agora?
