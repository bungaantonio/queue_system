from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.audit import Audit


def create_audit(
    db: Session,
    action: str,
    details: str | None = None,
    user_id: int | None = None,
    queue_item_id: int | None = None,
    biometric_id: int | None = None,
    operator_id: int | None = None,
) -> Audit:
    """
    Cria um registro de auditoria encadeado (com hash anterior).
    - Usa UTC consistente.
    - Garante cadeia de auditoria específica por queue_item_id quando aplicável.
    """
    # Busca o último audit relevante
    if queue_item_id is not None:
        last = (
            db.query(Audit)
            .filter(Audit.queue_item_id == queue_item_id)
            .order_by(Audit.id.desc())
            .first()
        )
    else:
        last = db.query(Audit).order_by(Audit.id.desc()).first()

    previous_hash = last.hashed_record if last else None

    # Cria o registro de auditoria
    audit = Audit(
        action=action.strip(),
        details=details.strip() if details else None,
        user_id=user_id,
        queue_item_id=queue_item_id,
        biometric_id=biometric_id,
        operator_id=operator_id,
        hashed_previous=previous_hash,
        timestamp=datetime.now(timezone.utc),
    )

    # Calcula o hash final
    audit.hashed_record = audit.hashed_compute()

    db.add(audit)
    db.flush()
    return audit


def get_audits(
    db: Session, skip: int = 0, limit: int = 100, queue_item_id: int | None = None
) -> list[Audit]:
    """
    Retorna uma lista de auditorias, opcionalmente filtrando por queue_item_id.
    """
    query = db.query(Audit)
    if queue_item_id is not None:
        query = query.filter(Audit.queue_item_id == queue_item_id)
    return query.order_by(Audit.timestamp.asc()).offset(skip).limit(limit).all()


def get_audit_by_id(db: Session, audit_id: int) -> Audit | None:
    """Busca um registro de auditoria pelo ID."""
    return db.query(Audit).filter(Audit.id == audit_id).first()


def get_previous_audit(db: Session, audit_id: int) -> Audit | None:
    """
    Retorna o audit imediatamente anterior do mesmo queue_item_id, garantindo
    sequência correta mesmo que IDs não sejam contínuos.
    """
    current = db.query(Audit).filter(Audit.id == audit_id).first()
    if not current or not current.queue_item_id:
        return None

    return (
        db.query(Audit)
        .filter(Audit.queue_item_id == current.queue_item_id, Audit.id < audit_id)
        .order_by(Audit.id.desc())
        .first()
    )
