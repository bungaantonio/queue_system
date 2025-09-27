from sqlalchemy.orm import Session
from datetime import datetime
from app.models.audit import Audit


def create_audit(
    db: Session,
    action: str,
    details: str | None = None,
    user_id: int | None = None,
    queue_item_id: int | None = None,
    biometric_id: int | None = None,
    operator_id: int | None = None,
):
    last = db.query(Audit).order_by(Audit.id.desc()).first()
    previous_hash = last.record_hash if last else None

    audit = Audit(
        action=action,
        details=details,
        user_id=user_id,
        queue_item_id=queue_item_id,
        biometric_id=biometric_id,
        operator_id=operator_id,
        previous_hash=previous_hash,
        timestamp=datetime.utcnow(),
    )

    audit.record_hash = audit.compute_hash()

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit


def get_audits(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Audit).offset(skip).limit(limit).all()


def get_audit_by_id(db: Session, audit_id: int) -> Audit | None:
    return db.query(Audit).filter(Audit.id == audit_id).first()


def get_previous_audit(db: Session, audit_id: int) -> Audit | None:
    return db.query(Audit).filter(Audit.id == audit_id - 1).first()
