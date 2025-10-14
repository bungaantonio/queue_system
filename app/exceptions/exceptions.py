from app.messages.messages import QUEUE_ERRORS, BIOMETRIC_ERRORS


class QueueException(Exception):
    """Exceções relacionadas à fila de atendimento."""

    def __init__(self, code: str):
        self.code = code or "queue_unknown"
        self.status_code, self.message = QUEUE_ERRORS.get(
            self.code, (400, "Erro desconhecido na fila")
        )

    def __str__(self):
        return f"[{self.code}] {self.message}"


class BiometricException(Exception):
    """Exceções relacionadas à biometria."""

    def __init__(self, code: str):
        self.code = code or "biometric_unknown"
        self.status_code, self.message = BIOMETRIC_ERRORS.get(
            self.code, (400, "Erro biométrico desconhecido")
        )

    def __str__(self):
        return f"[{self.code}] {self.message}"
