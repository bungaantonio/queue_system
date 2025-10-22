from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.helpers.audit_helpers import audit_queue_action
from app.models.enums import QueueStatus, AuditAction
from app.models.queue_item import QueueItem

from app.crud.biometric_crud import consult
from app.services.biometric_service import utils


def mark_as_called(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    """
    Marca o usuário como chamado, preparando call_token e biometric_hash.
    """
    old_status = item.status
    item.status = QueueStatus.CALLED_PENDING
    item.attempted_verification = False
    item.timestamp = datetime.now(timezone.utc)

    # Biometric hash
    biometric = consult.get_first_biometric_by_user(db, item.user_id)
    if not biometric:
        raise ValueError(f"Usuário {item.user_id} não possui biometria registrada.")
    item.biometric_hash = utils.make_biometric_hash(biometric.biometric_id)

    # Call token
    item.call_token, item.call_token_expires_at = utils.generate_call_token()
    db.flush()

    # capture new_status localmente (defensivo)
    new_status = item.status

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_called: {old_status} -> {new_status}, call_token set, biometric_hash set",
    )

    return item


def mark_as_done(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    old_status = item.status
    item.status = QueueStatus.DONE
    item.timestamp = datetime.now(timezone.utc)
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_done: {old_status} -> {item.status}",
    )
    return item


def mark_as_cancelled(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    """
    Marca o item como CANCELLED e ajusta as posições subsequentes de forma transacional.
    Deve ser chamada dentro de um contexto `with db.begin():`.
    """
    old_position = item.position
    old_status = item.status

    # Atualiza status do item
    item.status = QueueStatus.CANCELLED
    db.flush()  # garante que o status já esteja persistido antes do UPDATE em massa

    # Ajusta posições da fila (somente quem está atrás e ainda aguardando/chamado)
    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )
    db.flush()  # sincroniza o novo estado das posições

    # Auditoria dentro da transação
    new_status = item.status
    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_cancelled: {old_status} -> {new_status}, adjusted positions from {old_position}",
    )

    return item


def mark_as_skipped(
    db: Session,
    item: QueueItem,
    operator_id: int | None = None,
    offset: int = 2,
) -> QueueItem:
    """
    Marca o item como 'pulado' (SKIPPED) e o move algumas posições abaixo na fila.
    O status permanece WAITING, permitindo que o cidadão ainda seja atendido.
    """

    old_status = item.status
    old_position = item.position

    # Calcula a nova posição (2 abaixo por padrão)
    max_position = db.query(func.max(QueueItem.position)).scalar() or old_position
    new_position = min(old_position + offset, max_position)

    # Move os que estão entre as posições
    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.position <= new_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )

    # Atualiza o próprio item
    item.status = QueueStatus.WAITING

    if new_position == old_position:
        return item

    item.timestamp = datetime.now(timezone.utc)
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_skipped: {old_status} -> WAITING (moved from pos {old_position} to {new_position})",
    )

    return item


def mark_attempted_verification(
    db: Session, queue_item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    """
    Marca que o usuário tentou a verificação biométrica.
    """
    queue_item.attempted_verification = True
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        queue_item,
        operator_id,
        f"mark_attempted_verification: user_id={queue_item.user_id}",
    )
    return queue_item
