from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from app.models.audit import Audit
from app.crud import audit_crud
from app.schemas.audit_schema import AuditVerificationDetail
import logging

logger = logging.getLogger(__name__)


class AuditService:

    @staticmethod
    def log_action(db: Session, **kwargs) -> Audit:
        """Cria um registro de auditoria usando o CRUD."""
        return audit_crud.create_audit(db, **kwargs)

    @staticmethod
    def _verify_single(
        audit: Audit, previous_hash: str | None
    ) -> AuditVerificationDetail:
        """
        Verifica a validade de um registro de auditoria individual.
        Checa se o hash armazenado corresponde ao recalculado e se o previous_hash confere.
        """
        recalculated = audit.compute_hash()
        previous_matches = audit.previous_hash == previous_hash
        valid = (recalculated == audit.record_hash) and previous_matches

        logger.debug(
            "Audit %s verification: recalculated=%s, stored=%s, prev_match=%s, valid=%s",
            audit.id, recalculated, audit.record_hash, previous_matches, valid
        )

        return AuditVerificationDetail(
            audit_id=audit.id,
            recalculated_hash=recalculated,
            stored_hash=audit.record_hash,
            previous_hash_matches=previous_matches,
            valid=valid,
        )

    @staticmethod
    def verify_chain(db: Session) -> List[AuditVerificationDetail]:
        """Valida toda a cadeia de auditoria."""
        audits = db.query(Audit).order_by(Audit.id.asc()).all()
        last_hash = None
        results: List[AuditVerificationDetail] = []

        for audit in audits:
            result = AuditService._verify_single(audit, last_hash)
            results.append(result)
            last_hash = audit.record_hash

        logger.info("Audit chain verification completed: %d records checked", len(results))
        return results

    @staticmethod
    def verify_single_audit(
        db: Session, audit_id: int
    ) -> AuditVerificationDetail | None:
        """Valida um único registro de auditoria pelo ID."""
        audit = audit_crud.get_audit_by_id(db, audit_id)
        if not audit:
            logger.warning("Audit ID %d not found", audit_id)
            return None

        previous_audit = audit_crud.get_previous_audit(db, audit.id)
        previous_hash = previous_audit.record_hash if previous_audit else None
        return AuditService._verify_single(audit, previous_hash)

    @staticmethod
    def generate_audit_report(
        db: Session,
        user_id: int | None = None,
        action: str | None = None,
        start: datetime | None = None,
        end: datetime | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[AuditVerificationDetail]:
        """Gera um relatório filtrado de auditoria, com validação de cada registro."""
        query = db.query(Audit).order_by(Audit.id.asc())

        if user_id is not None:
            query = query.filter(Audit.user_id == user_id)
        if action:
            query = query.filter(Audit.action == action)
        if start:
            query = query.filter(Audit.timestamp >= start)
        if end:
            query = query.filter(Audit.timestamp <= end)

        audits = query.offset(skip).limit(limit).all()
        last_hash = None
        report: List[AuditVerificationDetail] = []

        for audit in audits:
            report.append(AuditService._verify_single(audit, last_hash))
            last_hash = audit.record_hash

        logger.info("Audit report generated: %d records", len(report))
        return report
