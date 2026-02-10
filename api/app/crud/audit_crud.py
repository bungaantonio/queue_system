from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.models.audit import Audit
from typing import Optional


def create_audit(
    db: Session,
    action: str,
    details: Optional[dict | str] = None,
    user_id: Optional[int] = None,
    queue_item_id: Optional[int] = None,
    credential_id: Optional[int] = None,
    operator_id: Optional[int] = None,
    hashed_previous: Optional[str] = None,  # passado externamente pelo serviço
) -> Audit:
    """
    Cria um registro de auditoria.
    - Não determina hashed_previous; isso é responsabilidade do serviço.
    """
    audit = Audit(
        action=action.strip(),
        details=details,
        user_id=user_id,
        queue_item_id=queue_item_id,
        credential_id=credential_id,
        operator_id=operator_id,
        hashed_previous=hashed_previous,
        timestamp=datetime.now(timezone.utc),
    )

    # Gera hash do registro
    audit.finalize_record()

    db.add(audit)
    db.flush()  # commit será feito no serviço
    return audit


def get_audits(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    queue_item_id: Optional[int] = None,
    user_id: Optional[int] = None,
    action: Optional[str] = None,
) -> list[type[Audit]]:
    """
    Lista auditorias, opcionalmente filtrando por queue_item_id, user_id ou action.
    """
    query = db.query(Audit)
    if queue_item_id is not None:
        query = query.filter(Audit.queue_item_id == queue_item_id)
    if user_id is not None:
        query = query.filter(Audit.user_id == user_id)
    if action is not None:
        query = query.filter(Audit.action == action)
    return query.order_by(Audit.timestamp.asc()).offset(skip).limit(limit).all()


def get_audit_by_id(db: Session, audit_id: int) -> Optional[Audit]:
    """Busca auditoria pelo ID."""
    return db.query(Audit).filter(Audit.id == audit_id).first()


def get_previous_audit(db: Session, audit_id: int) -> Optional[Audit]:
    """
    Retorna o audit imediatamente anterior do mesmo queue_item_id.
    - Sequência lógica, não contínua de IDs.
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
