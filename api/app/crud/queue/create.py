from datetime import datetime, timezone
import logging
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.crud.queue.read import get_existing_queue_item, get_next_position
from app.helpers.priority_policy import calculate_priority
from app.helpers.audit_helpers import audit_queue_action
from app.helpers.sla_policy import calculate_sla
from app.models.enums import QueueStatus, AttendanceType, AuditAction
from app.models.queue_item import QueueItem

from app.services.user_service import consult


logger = logging.getLogger(__name__)


def _insert(
    db: Session,
    user,
    operator_id: int,
    status: QueueStatus = QueueStatus.WAITING,
    attendance_type: AttendanceType = AttendanceType.NORMAL,
    allow_duplicate: bool = False,
) -> QueueItem:
    """
    Insere um novo item na fila, evitando duplicidade.
    Define posição, prioridade, tipo de atendimento, status e SLA.
    Registra auditoria.
    NÃO faz commit — transação deve ser controlada pelo serviço chamador.
    """

    if not allow_duplicate:
        existing_item = get_existing_queue_item(db, user.id)
        if existing_item:
            return existing_item

    # Calcula posição
    max_position = get_next_position(db)

    # Calcula prioridade
    priority_score, priority_reason = calculate_priority(user, attendance_type)

    # Calcula SLA usando política madura
    sla_minutes, sla_reason = calculate_sla(user, attendance_type)

    # --- INFO ---
    logger.info(
        f"Inserindo usuário {user.name} ({user.id}), Attendance: {attendance_type}, "
        f"Priority: {priority_score} ({priority_reason}), SLA: {sla_minutes}min, "
        f"Max position: {max_position}"
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
    return _insert(
        db,
        user,
        operator_id=operator_id,
        status=QueueStatus.WAITING,
        attendance_type=attendance_type,
        allow_duplicate=False,
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
    return _insert(
        db,
        user,
        operator_id=operator_id,
        status=QueueStatus.WAITING,
        attendance_type=attendance_type,
        allow_duplicate=True,
    )
