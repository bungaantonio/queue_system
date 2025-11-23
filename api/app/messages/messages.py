QUEUE_ERRORS = {
    # Situações normais, sem ação possível
    "no_active_service": (200, "Nenhum usuário está em atendimento"),
    "no_active_user": (200, "Nenhum usuário ativo para cancelar"),
    "no_called_user": (200, "Nenhum usuário foi chamado"),
    "no_waiting_user": (200, "Ninguém na fila de espera"),
    # Tentativas inválidas de ação
    "user_attempted_verification": (
        400,
        "Usuário já tentou verificação e não pode ser pulado",
    ),
    "queue_item_not_called_or_not_pending": (
        400,
        "Usuário não foi chamado ou não está pendente de verificação",
    ),
    "invalid_or_expired_call_token": (
        400,
        "O token de chamada é inválido ou expirou. Gere um novo token para prosseguir.",
    ),
    # Conflitos de estado
    "blocked_pending_verification": (
        409,
        "Há usuário pendente de verificação. Use /skip ou aguarde a validação",
    ),
    # Recursos inexistentes
    "user_not_found": (404, "Usuário não existe"),
    "empty": (404, "Não há usuários aguardando na fila"),
}


BIOMETRIC_ERRORS = {
    # Tentativas inválidas de ação
    "user_no_biometric": (
        400,
        "Usuário sem biometria. Use /skip para continuar a fila",
    ),
    "biometric_mismatch": (403, "Biometria não corresponde ao usuário chamado"),
    "biometric_already_registered": (409, "Usuário já possui biometria cadastrada"),
    # Recursos inexistentes
    "user_not_called_in_queue": (404, "Usuário não está na fila ou não foi chamado"),
    "biometric_not_found": (404, "Template biométrico não encontrado no sistema"),
}
