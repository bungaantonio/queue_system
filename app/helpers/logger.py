# /helpers/logger.py
import logging
from logging.handlers import RotatingFileHandler
import os
import json
from typing import Any, Dict

# Campos sensíveis que serão mascarados
SENSITIVE_FIELDS = {"document_id", "phone", "biometric_hash"}

def mask_sensitive(data: Dict[str, Any]) -> Dict[str, Any]:
    """Mascarar dados sensíveis em um dicionário."""
    masked = {}
    for k, v in data.items():
        if k in SENSITIVE_FIELDS:
            masked[k] = "****"
        elif isinstance(v, dict):
            masked[k] = mask_sensitive(v)
        else:
            masked[k] = v
    return masked

class MaskingFilter(logging.Filter):
    """Filtro de logging para mascarar dados sensíveis."""
    def filter(self, record: logging.LogRecord) -> bool:
        if hasattr(record, "extra_data"):
            record.msg = record.getMessage() + " | data=" + json.dumps(mask_sensitive(record.extra_data))
        return True

class LoggerManager:
    """Singleton para configuração de logger profissional."""
    _instance = None

    def __new__(cls, log_dir: str = "logs", name: str = "queue_system", max_bytes: int = 5_000_000, backup_count: int = 5, level: int = logging.DEBUG):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._setup(log_dir, name, max_bytes, backup_count, level)
        return cls._instance

    def _setup(self, log_dir, name, max_bytes, backup_count, level):
        os.makedirs(log_dir, exist_ok=True)
        self.logger = logging.getLogger(name)
        self.logger.setLevel(level)

        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        )

        # Rotating file handler
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, f"{name}.log"),
            maxBytes=max_bytes,
            backupCount=backup_count,
            encoding="utf-8"
        )
        file_handler.setFormatter(formatter)
        file_handler.addFilter(MaskingFilter())

        # Console handler para dev
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        console_handler.addFilter(MaskingFilter())

        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)

    def get_logger(self) -> logging.Logger:
        return self.logger

# Helper de uso rápido
def get_logger(name: str = "queue_system") -> logging.Logger:
    return LoggerManager(name=name).get_logger()
