from app.messages.messages import QUEUE_ERRORS, BIOMETRIC_ERRORS


class QueueException(Exception):
    def __init__(self, code: str):
        self.code = code
        self.status, self.message = QUEUE_ERRORS.get(
            code, (400, "Erro na fila desconhecido")
        )


class BiometricException(Exception):
    def __init__(self, code: str):
        self.code = code
        self.status, self.message = BIOMETRIC_ERRORS.get(
            code, (400, "Erro biométrico desconhecido")
        )
