# app/helpers/audit_helpers.py
from typing import Any, Dict, Literal, Optional, cast

from sqlalchemy.orm import Session

from app.models.audit import Audit
from app.models.enums import AttendanceType, AuditAction
from app.models.queue_item import QueueItem
from app.services.audit_service import AuditService

AuditDetails = Dict[str, Any]


def _action_value(action: str | AuditAction) -> str:
    return action.value if isinstance(action, AuditAction) else action


def build_audit_details(
        action: str | AuditAction,
        status: Literal["success", "failed", "pending"] = "success",
        msg: str = "",
        extra: Dict[str, Any] | None = None
) -> AuditDetails:
    """Garante que todos os eventos de auditoria tenham mesma estrutura."""
    data = {
        "action": _action_value(action),
        "status": status,
        "msg": msg,
    }
    if extra:
        data.update(extra)
    return data


def audit_log(
        db: Session,
        action: str | AuditAction,
        operator_id: int | None = None,
        user_id: int | None = None,
        queue_item_id: int | None = None,
        credential_id: int | None = None,
        details: dict | None = None,
) -> Audit:
    # Contrato único de escrita de auditoria: service -> helper -> AuditService
    return AuditService.log_action(
        db=db,
        action=_action_value(action),
        operator_id=operator_id,
        user_id=user_id,
        queue_item_id=queue_item_id,
        credential_id=credential_id,
        details=details,
    )


def audit_queue_action(
        db: Session,
        action: str | AuditAction,
        item: QueueItem,
        operator_id: int | None = None,
        credential_id: int | None = None,  # Adicionei aqui para casos onde a bio é validada
        details: dict | None = None,
) -> Audit:
    # Contrato semântico de fila: QueueItem define automaticamente user_id + queue_item_id
    return audit_log(
        db=db,
        action=action,
        operator_id=operator_id,
        user_id=cast(Optional[int], item.user_id),  # Extração automática
        queue_item_id=cast(Optional[int], item.id),  # Extração automática
        credential_id=credential_id,
        details=details,
    )


def audit_operator_created(
        db: Session,
        actor_operator_id: int,
        target_operator_id: int,
        username: str,
        role: str,
) -> Audit:
    return audit_log(
        db=db,
        action=AuditAction.OPERATOR_CREATED,
        operator_id=actor_operator_id,
        details=build_audit_details(
            action=AuditAction.OPERATOR_CREATED,
            msg="Operador criado",
            extra={
                "target_operator_id": target_operator_id,
                "username": username,
                "role": role,
            },
        ),
    )


def audit_operator_updated(
        db: Session,
        actor_operator_id: int,
        target_operator_id: int,
        updated_fields: list[str],
) -> Audit:
    return audit_log(
        db=db,
        action=AuditAction.OPERATOR_UPDATED,
        operator_id=actor_operator_id,
        details=build_audit_details(
            action=AuditAction.OPERATOR_UPDATED,
            msg="Operador atualizado",
            extra={
                "target_operator_id": target_operator_id,
                "updated_fields": updated_fields,
            },
        ),
    )


def audit_operator_deactivated(
        db: Session,
        actor_operator_id: int,
        target_operator_id: int,
        username: str,
) -> Audit:
    return audit_log(
        db=db,
        action=AuditAction.OPERATOR_DEACTIVATED,
        operator_id=actor_operator_id,
        details=build_audit_details(
            action=AuditAction.OPERATOR_DEACTIVATED,
            msg="Operador desativado",
            extra={"target_operator_id": target_operator_id, "username": username},
        ),
    )


def audit_operator_deleted(
        db: Session,
        actor_operator_id: int,
        target_operator_id: int,
        username: str,
) -> Audit:
    return audit_log(
        db=db,
        action=AuditAction.OPERATOR_DELETED,
        operator_id=actor_operator_id,
        details=build_audit_details(
            action=AuditAction.OPERATOR_DELETED,
            msg="Operador eliminado",
            extra={"target_operator_id": target_operator_id, "username": username},
        ),
    )


def audit_operator_activated(
        db: Session,
        actor_operator_id: int,
        target_operator_id: int,
        username: str,
) -> Audit:
    return audit_log(
        db=db,
        action=AuditAction.OPERATOR_ACTIVATED,
        operator_id=actor_operator_id,
        details=build_audit_details(
            action=AuditAction.OPERATOR_ACTIVATED,
            msg="Operador ativado",
            extra={"target_operator_id": target_operator_id, "username": username},
        ),
    )


def audit_queue_requeued(
        db: Session,
        operator_id: int,
        item: QueueItem,
        attendance_type: AttendanceType,
) -> Audit:
    return audit_queue_action(
        db=db,
        action=AuditAction.QUEUE_UPDATED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.QUEUE_UPDATED,
            msg="Usuário recolocado na fila",
            extra={"operation": "requeue", "attendance_type": attendance_type},
        ),
    )


def audit_quick_entry(
        db: Session,
        operator_id: int,
        item: QueueItem,
        attendance_type: AttendanceType,
) -> Audit:
    return audit_queue_action(
        db=db,
        action=AuditAction.USER_ENQUEUED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.USER_ENQUEUED,
            msg="Usuário entrou rapidamente na fila",
            extra={"attendance_type": attendance_type},
        ),
    )


def audit_queue_token_exposed(
        db: Session,
        item: QueueItem,
        operator_id: int | None = None,
) -> Audit:
    return audit_queue_action(
        db=db,
        action=AuditAction.QUEUE_TOKEN_VIEWED,
        item=item,
        operator_id=operator_id,
        details=build_audit_details(
            action=AuditAction.QUEUE_TOKEN_VIEWED,
            msg="Token de chamada consultado",
            extra={
                "credential_verified": item.credential_verified,
                "call_token": item.call_token,
            },
        ),
    )


def get_last_verification_credential_for_queue_item(db: Session, queue_item_id: int) -> int | None:
    """
    Retorna o credential_id do último registro QUEUE_VERIFIED
    associado ao queue_item_id.
    """
    from app.models.audit import Audit  # evitar ciclo de import

    last_verified = (
        db.query(Audit)
        .filter(
            Audit.queue_item_id == queue_item_id,
            Audit.action == AuditAction.QUEUE_VERIFIED.value,
        )
        .order_by(Audit.id.desc())
        .first()
    )

    return cast(Optional[int], last_verified.credential_id) if last_verified else None
