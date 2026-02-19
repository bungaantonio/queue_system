from typing import Dict, Tuple

# Map de erros global do sistema
ErrorMap = Dict[str, Tuple[int, str]]

ERRORS: ErrorMap = {

    # ================= AUTH =================
    "auth.invalid_credentials": (401, "Credenciais inválidas."),
    "auth.refresh_invalid": (401, "Refresh token inválido."),
    "auth.refresh_expired": (401, "Refresh token expirado."),
    "auth.forbidden": (403, "Permissão insuficiente."),

    # ================= OPERATOR =================
    "operator.not_found": (404, "Operador não encontrado."),
    "operator.already_exists": (409, "Operador já cadastrado."),
    "operator.inactive": (403, "Operador desativado."),
    "operator.self_delete_forbidden": (403, "Não é permitido eliminar o próprio operador logado."),

    # ================= QUEUE =================
    "queue.item_not_called": (400, "Item não está em estado de chamada."),
    "queue.invalid_call_token": (401, "Token de chamada inválido ou expirado."),
    "queue.empty": (404, "Fila vazia."),
    "queue.user_not_found": (404, "Usuário não encontrado."),
    "queue.no_active_service": (404, "Não há atendimento ativo no momento."),
    "queue.no_called_user": (404, "Nenhum usuário chamado no momento."),
    "queue.user_already_registered": (409, "Usuário já cadastrado."),
    "queue.user_already_active": (409, "Usuário já possui atendimento ativo."),
    "queue.pending_verification_exists": (409, "Existe atendimento pendente."),
    "queue.user_attempted_verification": (409, "Usuário já tentou verificação biométrica e não pode ser chamado novamente."),


    # ================= CREDENTIAL =================
    "credential.not_found": (404, "Credencial não encontrada."),
    "credential.already_registered": (409, "Credencial já registada."),
    "credential.mismatch": (403, "Credencial não corresponde ao usuário."),

    # ================= AUDIT =================
    "audit.not_found": (404, "Registro de auditoria não encontrado."),

    # ================= SYSTEM =================
    "system.missing_parameter": (400, "Parâmetro obrigatório ausente."),
}
