import hashlib
from sqlalchemy.orm import Session
from app.crud import audit_crud
from app.models.audit import Audit


def log_action(db: Session, **kwargs):
    """Wrapper de alto nível para registrar ações."""
    return audit_crud.create_audit(db, **kwargs)


def verify_chain(db: Session) -> bool:
    audits = db.query(Audit).order_by(Audit.id.asc()).all()

    last_hash = None
    for audit in audits:
        # recalcular hash do registro
        recalculated = audit.compute_hash()

        if audit.record_hash != recalculated:
            return False  # hash adulterado

        if audit.previous_hash != last_hash:
            return False  # cadeia quebrada

        last_hash = audit.record_hash

    return True


def verify_single_audit(db: Session, audit_id: int) -> dict:
    audit = audit_crud.get_audit_by_id(db, audit_id)
    if not audit:
        return {"audit_id": audit_id, "exists": False, "chain_valid_from_here": False}

    # usa o método do model
    recalculated = audit.compute_hash()
    valid = recalculated == audit.record_hash

    if audit.previous_hash:
        prev = audit_crud.get_previous_audit(db, audit.id)
        if not prev or prev.record_hash != audit.previous_hash:
            valid = False

    return {
        "audit_id": audit.id,
        "exists": True,
        "chain_valid_from_here": valid,
        "recalculated_hash": recalculated,
        "stored_hash": audit.record_hash,
    }
