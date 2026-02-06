import hashlib
import json
import logging
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.audit import Audit
from app.crud import audit_crud
from app.schemas.audit_schema import AuditVerificationDetail

logger = logging.getLogger(__name__)


class AuditAction(str):
    QUEUE_CREATED = "Fila criada"
    QUEUE_UPDATED = "Fila atualizada"
    QUEUE_VERIFIED = "Fila verificada"
    QUEUE_PROCESSED = "Fila processada"
    QUEUE_CALLED = "Usuário chamado"
    QUEUE_SKIPPED = "Usuário pulado"
    QUEUE_CANCELLED = "Usuário cancelado"
    USER_CREATED = "Usuário criado"
    USER_UPDATED = "Usuário atualizado"


class AuditService:
    @staticmethod
    def log_action(
        db: Session,
        action: str,
        operator_id: Optional[int] = None,
        user_id: Optional[int] = None,
        queue_item_id: Optional[int] = None,
        biometric_id: Optional[int] = None,
        details: Optional[dict] = None,
    ) -> Audit:
        """
        Cria um registro de auditoria seguro, mantendo a cadeia (hash anterior).
        - details: dicionário que será serializado em JSON
        """
        # Serializar detalhes
        details_json = json.dumps(details or {}, ensure_ascii=False)

        # Recupera último registro para manter a cadeia
        last_audit = db.query(Audit).order_by(Audit.id.desc()).first()
        hashed_previous = last_audit.hashed_record if last_audit else None

        audit = Audit(
            operator_id=operator_id,
            user_id=user_id,
            queue_item_id=queue_item_id,
            biometric_id=biometric_id,
            action=action,
            details=details_json,
            hashed_previous=hashed_previous,
        )

        # Calcula hash final
        audit.hashed_record = audit.hashed_compute()

        db.add(audit)
        db.flush()  # garante id antes de commit
        logger.info(
            "Audit logged: action=%s, operator_id=%s, user_id=%s, queue_item_id=%s, id=%s",
            action, operator_id, user_id, queue_item_id, audit.id
        )
        return audit

    @staticmethod
    def _verify_single(audit: Audit, previous_hash: Optional[str]) -> AuditVerificationDetail:
        """
        Verifica a validade de um registro individual:
        - hash recalculado
        - hash anterior correto
        """
        recalculated = audit.hashed_compute()
        previous_matches = audit.hashed_previous == previous_hash
        valid = (recalculated == audit.hashed_record) and previous_matches

        logger.debug(
            "Audit %s verification: recalculated=%s, stored=%s, prev_match=%s, valid=%s",
            audit.id, recalculated, audit.hashed_record, previous_matches, valid
        )

        # Desserializa detalhes
        details = {}
        if audit.details:
            try:
                details = json.loads(audit.details)
            except json.JSONDecodeError:
                logger.warning("Audit %s details JSON decode failed", audit.id)

        return AuditVerificationDetail(
            audit_id=audit.id,
            recalculated_hash=recalculated,
            stored_hash=audit.hashed_record,
            previous_hash_matches=previous_matches,
            valid=valid,
            action=audit.action,
            operator_id=audit.operator_id,
            user_id=audit.user_id,
            queue_item_id=audit.queue_item_id,
            biometric_id=audit.biometric_id,
            details=details,
            timestamp=audit.timestamp,
        )

    @staticmethod
    def verify_chain(db: Session) -> List[AuditVerificationDetail]:
        """Valida toda a cadeia de auditoria em ordem cronológica."""
        audits = db.query(Audit).order_by(Audit.id.asc()).all()
        last_hash = None
        results: List[AuditVerificationDetail] = []

        for audit in audits:
            result = AuditService._verify_single(audit, last_hash)
            results.append(result)
            last_hash = audit.hashed_record

        logger.info("Audit chain verification completed: %d records checked", len(results))
        return results

    @staticmethod
    def verify_single_audit(db: Session, audit_id: int) -> Optional[AuditVerificationDetail]:
        """Valida um único registro pelo ID."""
        audit = audit_crud.get_audit_by_id(db, audit_id)
        if not audit:
            logger.warning("Audit ID %d not found", audit_id)
            return None

        previous_audit = audit_crud.get_previous_audit(db, audit.id)
        previous_hash = previous_audit.hashed_record if previous_audit else None
        return AuditService._verify_single(audit, previous_hash)

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
        """
        Gera relatório de auditoria filtrado, mantendo a cadeia de validação.
        """
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
            last_hash = audit.hashed_record

        logger.info("Audit report generated: %d records", len(report))
        return report
