import logging
from datetime import datetime
from typing import List, Optional, cast
from sqlalchemy.orm import Session
from app.models.audit import Audit
from app.models.operator import Operator
from app.models.user import User
from app.models.queue_item import QueueItem
from app.models.user_credential import UserCredential
from app.crud import audit_crud
from app.schemas.audit_schema import AuditVerificationDetail

logger = logging.getLogger(__name__)


class AuditService:
    @staticmethod
    def _exists_by_id(db: Session, model, record_id: Optional[int]) -> bool:
        if record_id is None:
            return True
        return db.query(model.id).filter(model.id == record_id).first() is not None

    @staticmethod
    def _sanitize_reference_ids(
        db: Session,
        operator_id: Optional[int],
        user_id: Optional[int],
        queue_item_id: Optional[int],
        credential_id: Optional[int],
    ) -> tuple[Optional[int], Optional[int], Optional[int], Optional[int]]:
        sanitized_operator_id = operator_id
        sanitized_user_id = user_id
        sanitized_queue_item_id = queue_item_id
        sanitized_credential_id = credential_id

        if not AuditService._exists_by_id(db, Operator, operator_id):
            logger.warning("Audit log ignored invalid operator_id=%s", operator_id)
            sanitized_operator_id = None

        if not AuditService._exists_by_id(db, User, user_id):
            logger.warning("Audit log ignored invalid user_id=%s", user_id)
            sanitized_user_id = None

        if not AuditService._exists_by_id(db, QueueItem, queue_item_id):
            logger.warning("Audit log ignored invalid queue_item_id=%s", queue_item_id)
            sanitized_queue_item_id = None

        if not AuditService._exists_by_id(db, UserCredential, credential_id):
            logger.warning("Audit log ignored invalid credential_id=%s", credential_id)
            sanitized_credential_id = None

        return (
            sanitized_operator_id,
            sanitized_user_id,
            sanitized_queue_item_id,
            sanitized_credential_id,
        )

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
        last_audit = audit_crud.get_last_audit(db)
        hashed_previous = (
            cast(Optional[str], last_audit.hashed_record) if last_audit else None
        )
        (
            operator_id,
            user_id,
            queue_item_id,
            credential_id,
        ) = AuditService._sanitize_reference_ids(
            db=db,
            operator_id=operator_id,
            user_id=user_id,
            queue_item_id=queue_item_id,
            credential_id=credential_id,
        )

        audit = audit_crud.create_audit(
            db=db,
            action=action,
            details=details or {},
            user_id=user_id,
            queue_item_id=queue_item_id,
            credential_id=credential_id,
            operator_id=operator_id,
            hashed_previous=hashed_previous,
        )

        logger.info(
            "Audit logged: action=%s, operator_id=%s, user_id=%s, queue_item_id=%s, id=%s",
            action,
            operator_id,
            user_id,
            queue_item_id,
            audit.id,
        )

        return audit

    @staticmethod
    def _to_verification_detail(
        audit: Audit, previous_hash: Optional[str]
    ) -> AuditVerificationDetail:
        audit_hashed_previous = cast(Optional[str], audit.hashed_previous)
        audit_hashed_record = cast(str, audit.hashed_record)
        recalculated = audit.compute_record_hash()
        prev_match = (
            previous_hash == audit_hashed_previous
            if previous_hash
            else (previous_hash is None)
        )
        valid = recalculated == audit_hashed_record and prev_match

        if isinstance(audit.details, dict):
            details = audit.details
        else:
            details = {}
            logger.warning(
                "Audit %s details têm tipo inesperado: %s",
                audit.id,
                type(audit.details),
            )

        return AuditVerificationDetail(
            id=cast(int, audit.id),
            action=cast(str, audit.action),
            operator_id=cast(Optional[int], audit.operator_id),
            user_id=cast(Optional[int], audit.user_id),
            queue_item_id=cast(Optional[int], audit.queue_item_id),
            credential_id=cast(Optional[int], audit.credential_id),
            recalculated_hash=recalculated,
            stored_hash=audit_hashed_record,
            previous_hash_matches=prev_match,
            valid=valid,
            details=details,
            timestamp=cast(datetime, audit.timestamp),
        )

    @staticmethod
    def verify_chain(db: Session) -> List[AuditVerificationDetail]:
        audits = audit_crud.get_all_audits(db)
        last_hash = None
        result: List[AuditVerificationDetail] = []

        for audit in audits:
            detail = AuditService._to_verification_detail(
                audit, cast(Optional[str], last_hash)
            )
            result.append(detail)
            last_hash = cast(str, audit.hashed_record)

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

        prev_audit = audit_crud.get_previous_audit(db, cast(int, audit.id))
        prev_hash = cast(Optional[str], prev_audit.hashed_record) if prev_audit else None
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
        audits = audit_crud.get_audits(
            db=db,
            skip=skip,
            limit=limit,
            user_id=user_id,
            action=action,
            start=start,
            end=end,
        )
        report: List[AuditVerificationDetail] = []
        last_hash = None

        if audits:
            previous = audit_crud.get_previous_audit(db, cast(int, audits[0].id))
            last_hash = (
                cast(Optional[str], previous.hashed_record) if previous else None
            )

        for audit in audits:
            report.append(
                AuditService._to_verification_detail(audit, cast(Optional[str], last_hash))
            )
            last_hash = cast(str, audit.hashed_record)

        logger.info("Audit report generated: %d records", len(report))
        return report
