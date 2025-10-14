QUEUE_ERRORS = {
    "empty": (404, "Não há usuários aguardando na fila"),
    "blocked_pending_verification": (
        409,
        "Há usuário pendente de verificação. Use /skip ou aguarde a validação",
    ),
    "user_not_found": (
        404,
        "Usuário não existe",
    ),  # continua usado no manual_insert
    "no_active_service": (404, "Nenhum usuário está em atendimento"),
    "no_called_user": (404, "Nenhum usuário foi chamado"),
    "user_attempted_verification": (
        400,
        "Usuário tentou verificação. Não pode ser pulado",
    ),
}


BIOMETRIC_ERRORS = {
    "user_no_biometric": (
        400,
        "Usuário sem biometria. Use /skip para continuar a fila",
    ),
    "biometric_mismatch": (403, "Biometria não corresponde ao usuário chamado"),
    "user_not_called_in_queue": (404, "Usuário não está na fila ou não foi chamado"),
    "biometric_not_found": (404, "Template biométrico não encontrado no sistema"),
    "biometric_already_registered": (409, "Usuário já possui biometria cadastrada"),
}
