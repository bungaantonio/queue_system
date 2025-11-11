from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.helpers.logger import get_logger
from app.helpers.priority_policy import calculate_priority
from app.helpers.audit_helpers import audit_queue_action
from app.helpers.sla_policy import calculate_sla
from app.models.enums import QueueStatus, AttendanceType, AuditAction
from app.models.queue_item import QueueItem

from . import read

logger = get_logger(__name__)


def _insert(
    db: Session,
    user,
    operator_id: int,
    status: QueueStatus = QueueStatus.WAITING,
    attendance_type: AttendanceType = AttendanceType.NORMAL,
) -> QueueItem:
    """
    Insere um novo item na fila, evitando duplicidade.
    Define posição, prioridade, tipo de atendimento, status e SLA.
    Registra auditoria.
    NÃO faz commit — transação deve ser controlada pelo serviço chamador.
    """
    # Verifica se o usuário já possui item ativo na fila
    existing_item = read.get_existing_queue_item(db, user_id=user.id)
    if existing_item:
        logger.debug(
            "Usuário já possui item ativo na fila, evitando duplicação",
            extra={"extra_data": {"user_id": user.id, "item_id": existing_item.id}},
        )
        return existing_item  # Evita duplicação

    # Calcula posição
    max_position = db.query(func.max(QueueItem.position)).scalar() or 0

    # Calcula prioridade
    priority_score, priority_reason = calculate_priority(user, attendance_type)

    # Calcula SLA usando política madura
    sla_minutes, sla_reason = calculate_sla(user, attendance_type)

    # --- DEBUG ---
    logger.debug(
        "Inserindo novo item na fila",
        extra={
            "extra_data": {
                "user_id": user.id,
                "user_name": user.name,
                "birth_date": user.birth_date.isoformat() if user.birth_date else None,
                "attendance_type": attendance_type.value,
                "priority_score": priority_score,
                "priority_reason": priority_reason,
                "sla_minutes": sla_minutes,
                "sla_reason": sla_reason,
                "max_position": max_position,
                "status": status.value,
            }
        },
    )
    # --------------

    # Cria o item de fila
    item = QueueItem(
        user_id=user.id,
        status=status,
        position=max_position + 1,
        timestamp=datetime.now(timezone.utc),
        priority_score=priority_score,
        priority_reason=priority_reason,
        attendance_type=attendance_type,
    )

    # Define SLA, se aplicável
    if sla_minutes:
        item.set_sla_deadline(sla_minutes)

    db.add(item)
    db.flush()  # Garante que item.id existe sem fazer commit

    # Auditoria
    audit_queue_action(
        db,
        AuditAction.QUEUE_CREATED,
        item,
        operator_id,
        f"Inserted user {user.id} into queue at position {item.position}, "
        f"status={status}, priority={priority_score}, SLA={sla_minutes}min",
    )

    logger.info(
        "Item de fila criado com sucesso",
        extra={
            "extra_data": {
                "user_id": user.id,
                "item_id": item.id,
                "position": item.position,
            }
        },
    )

    # Retorna o item com relacionamento carregado
    return (
        db.query(QueueItem)
        .options(joinedload(QueueItem.user))
        .filter_by(id=item.id)
        .first()
    )


def enqueue_user(
    db: Session,
    user,
    operator_id: int,
    attendance_type: AttendanceType = AttendanceType.NORMAL,
) -> QueueItem:
    """
    Insere o cidadão na fila, caso ainda não esteja.
    """
    existing = read.get_existing_queue_item(db, user.id)
    if existing:
        logger.debug(
            "enqueue_user: usuário já na fila",
            extra={"extra_data": {"user_id": user.id, "item_id": existing.id}},
        )
        return existing

    return _insert(
        db,
        user,
        status=QueueStatus.WAITING,
        attendance_type=attendance_type,
        operator_id=operator_id,
    )


def requeue_user(
    db: Session,
    user,
    operator_id: int,
    attendance_type: AttendanceType = AttendanceType.NORMAL,
) -> QueueItem:
    """
    Reinsere o cidadão na fila (novo registro, mesmo usuário).
    """
    logger.debug(
        "Reenfileirando usuário",
        extra={
            "extra_data": {"user_id": user.id, "attendance_type": attendance_type.value}
        },
    )
    return _insert(
        db,
        user,
        status=QueueStatus.WAITING,
        attendance_type=attendance_type,
        operator_id=operator_id,
    )
