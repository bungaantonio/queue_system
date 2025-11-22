# app/helpers/audit_helpers.py
from app.crud.audit_crud import create_audit
from app.models.audit import Audit
from sqlalchemy.orm import Session

from app.models.enums import AuditAction
from app.models.queue_item import QueueItem


def audit_queue_action(
    db,
    action: str,
    item: QueueItem,
    operator_id: int | None = None,
    details: str | None = None,
):
    """
    Cria registro de auditoria para operações da fila.
    """
    return create_audit(
        db,
        action=action,
        details=details,
        user_id=item.user_id,
        queue_item_id=item.id,
        operator_id=operator_id,
    )


def get_biometric_for_finished(db: Session, queue_item_id: int) -> int | None:
    """
    Retorna o biometric_id do último registro QUEUE_VERIFIED
    associado ao queue_item_id, ou None se não existir.
    """
    last_verified = (
        db.query(Audit)
        .filter(
            Audit.queue_item_id == queue_item_id,
            Audit.action == AuditAction.QUEUE_VERIFIED,
        )
        .order_by(Audit.id.desc())
        .first()
    )
    return last_verified.biometric_id if last_verified else None
