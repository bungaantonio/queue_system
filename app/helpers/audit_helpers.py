# app/helpers/audit_helpers.py
from app.models.audit import Audit
from sqlalchemy.orm import Session


def get_biometric_for_finished(db: Session, queue_item_id: int) -> int | None:
    """
    Retorna o biometric_id do último registro QUEUE_VERIFIED
    associado ao queue_item_id, ou None se não existir.
    """
    last_verified = (
        db.query(Audit)
        .filter(Audit.queue_item_id == queue_item_id, Audit.action == "QUEUE_VERIFIED")
        .order_by(Audit.id.desc())
        .first()
    )
    return last_verified.biometric_id if last_verified else None
