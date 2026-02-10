# app/helpers/audit_helpers.py
from sqlalchemy.orm import Session
from typing import Literal, Any, Dict

from app.models.enums import AuditAction
from app.services.audit_service import AuditService
from app.models.queue_item import QueueItem

AuditDetails = Dict[str, Any]


def build_audit_details(
        action: str,
        status: Literal["success", "failed", "pending"] = "success",
        msg: str = "",
        extra: Dict[str, Any] = None
) -> AuditDetails:
    """Garante que todos os eventos de auditoria tenham mesma estrutura."""
    data = {
        "action": action,
        "status": status,
        "msg": msg,
    }
    if extra:
        data.update(extra)
    return data


def audit_log(
        db: Session,
        action: str,
        operator_id: int | None = None,
        user_id: int | None = None,
        queue_item_id: int | None = None,
        credential_id: int | None = None,
        details: dict | None = None,
):
    # Usamos argumentos nomeados (key=value) para chamar o Service com segurança
    return AuditService.log_action(
        db=db,
        action=action,
        operator_id=operator_id,
        user_id=user_id,
        queue_item_id=queue_item_id,
        credential_id=credential_id,
        details=details,
    )


def audit_queue_action(
        db: Session,
        action: str,
        item: QueueItem,
        operator_id: int | None = None,
        credential_id: int | None = None,  # Adicionei aqui para casos onde a bio é validada
        details: dict | None = None,
):
    # Aqui está a inteligência: mapear o objeto ‘item’ para as colunas do ‘log’
    return audit_log(
        db=db,
        action=action,
        operator_id=operator_id,
        user_id=item.user_id,  # Extração automática
        queue_item_id=item.id,  # Extração automática
        credential_id=credential_id,
        details=details,
    )


def get_last_verification_credential_for_queue_item(db: Session, queue_item_id: int) -> int | None:
    """
    Retorna o credential_id do último registro QUEUE_VERIFIED
    associado ao queue_item_id.
    """
    from app.models.audit import Audit  # evitar ciclo de import

    last_verified = (
        db.query(Audit)
        .filter(
            Audit.queue_item_id == queue_item_id,
            Audit.action == AuditAction.QUEUE_VERIFIED,
        )
        .order_by(Audit.id.desc())
        .first()
    )

    return last_verified.credential_id if last_verified else None
