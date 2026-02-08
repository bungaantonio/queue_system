import json
import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.audit import Audit
from app.crud import audit_crud
from app.schemas.audit_schema import AuditVerificationDetail

logger = logging.getLogger(__name__)


class AuditService:
    @staticmethod
    def log_action(
            db: Session,
            action: str,
            operator_id: Optional[int] = None,
            user_id: Optional[int] = None,
            queue_item_id: Optional[int] = None,
            credential_id: Optional[int] = None,
            details: Optional[dict] = None,
    ) -> Audit:
        """Cria um registro de auditoria com hash encadeado."""
        last_audit = db.query(Audit).order_by(Audit.id.desc()).first()
        hashed_previous = last_audit.hashed_record if last_audit else None

        audit = Audit(
            operator_id=operator_id,
            user_id=user_id,
            queue_item_id=queue_item_id,
            credential_id=credential_id,
            action=action,
            details=details or {},
            hashed_previous=hashed_previous,
        )
        audit.finalize_record()

        logger.info(
            "Audit logged: action=%s, operator_id=%s, user_id=%s, queue_item_id=%s, id=%s",
            action,
            operator_id,
            user_id,
            queue_item_id,
            audit.id,
        )

        db.add(audit)
        db.flush()

        return audit

    @staticmethod
    def _to_verification_detail(
            audit: Audit, previous_hash: Optional[str]
    ) -> AuditVerificationDetail:
        recalculated = audit.finalize_record()
        prev_match = (
            previous_hash == audit.hashed_previous
            if previous_hash
            else (previous_hash is None)
        )
        valid = recalculated == audit.hashed_record and prev_match

        try:
            details = json.loads(audit.details) if audit.details else {}
        except json.JSONDecodeError:
            logger.warning("Audit %s details JSON decode failed", audit.id)
            details = {}

        return AuditVerificationDetail(
            id=audit.id,
            action=audit.action,
            operator_id=audit.operator_id,
            user_id=audit.user_id,
            queue_item_id=audit.queue_item_id,
            credential_id=audit.credential_id,
            recalculated_hash=recalculated,
            stored_hash=audit.hashed_record,
            previous_hash_matches=prev_match,
            valid=valid,
            details=details,
            timestamp=audit.timestamp,
        )

    @staticmethod
    def verify_chain(db: Session) -> List[AuditVerificationDetail]:
        audits = db.query(Audit).order_by(Audit.id.asc()).all()
        last_hash = None
        result: List[AuditVerificationDetail] = []

        for audit in audits:
            detail = AuditService._to_verification_detail(audit, last_hash)
            result.append(detail)
            last_hash = audit.hashed_record

        logger.info("Audit chain verification completed: %d records", len(result))
        return result

    @staticmethod
    def verify_single_audit(
            db: Session, audit_id: int
    ) -> Optional[AuditVerificationDetail]:
        audit = audit_crud.get_audit_by_id(db, audit_id)
        if not audit:
            logger.warning("Audit ID %d not found", audit_id)
            return None

        prev_audit = audit_crud.get_previous_audit(db, audit.id)
        prev_hash = prev_audit.hashed_record if prev_audit else None
        return AuditService._to_verification_detail(audit, prev_hash)

    @staticmethod
    def generate_audit_report(
            db: Session,
            user_id: Optional[int] = None,
            action: Optional[str] = None,
            start: Optional[datetime] = None,
            end: Optional[datetime] = None,
            skip: int = 0,
            limit: int = 100,
    ) -> List[AuditVerificationDetail]:
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
            report.append(AuditService._to_verification_detail(audit, last_hash))
            last_hash = audit.hashed_record

        logger.info("Audit report generated: %d records", len(report))
        return report
