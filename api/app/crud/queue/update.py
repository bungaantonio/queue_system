# app/crud/queue/update.py
from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.crud.queue.read import get_next_position
from app.helpers.audit_helpers import audit_queue_action
from app.models.enums import QueueStatus, AuditAction
from app.models.queue_item import QueueItem
from app.crud.biometric import get_first_biometric_by_user
from app.models.user_credential import UserCredential
from app.services.biometric_service import utils


def mark_as_called(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    """
    Marca o usuário como chamado e gera os tokens de sessão.
    """
    old_status = item.status
    item.status = QueueStatus.CALLED_PENDING
    item.attempted_verification = False
    item.timestamp = datetime.now(timezone.utc)

    # 1. Gerar Call Token (Obrigatório para a sessão de atendimento)
    # Usando o nome correto da função em utils.py
    item.call_token, item.call_token_expires_at = utils.generate_call_token()

    # 2. Buscar a credencial do usuário (Opcional aqui, obrigatório na autenticação)
    # Não travamos o processo se não encontrar, apenas logamos.
    credential = (
        db.query(UserCredential)
        .filter(
            UserCredential.user_id == item.user_id, UserCredential.cred_type == "zkteco"
        )
        .first()
    )

    if credential:
        # Se ele tem biometria física, guardamos o hash no item da fila para conferência rápida
        item.biometric_hash = credential.identifier
    else:
        # Se não tem ZKTeco, ele pode estar usando WebAuthn (não precisa de hash prévio na fila)
        item.biometric_hash = None

    db.flush()
    db.refresh(item)

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_called: {old_status} -> {item.status}, token generated",
    )
    return item


def mark_as_done(
    db: Session, item: QueueItem, operator_id: int | None = None
) -> QueueItem:
    old_status = item.status
    item.status = QueueStatus.DONE
    item.timestamp = datetime.now(timezone.utc)

    db.flush()
    db.refresh(item)

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
    """
    old_position = item.position
    old_status = item.status

    item.status = QueueStatus.CANCELLED
    db.flush()
    db.refresh(item)

    # Ajusta posições de forma segura
    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )
    db.flush()

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        item,
        operator_id,
        f"mark_as_cancelled: {old_status} -> {item.status}, adjusted positions from {old_position}",
    )
    return item


def mark_as_skipped(
    db: Session,
    item: QueueItem,
    operator_id: int | None = None,
    offset: int = 2,
) -> QueueItem:
    """
    Marca o item como 'pulado' e o move algumas posições abaixo na fila.
    """
    old_status = item.status
    old_position = item.position

    max_position = get_next_position(db) - 1
    new_position = min(old_position + offset, max_position)

    # Atualiza posições dos outros itens
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
    item.position = new_position
    item.timestamp = datetime.now(timezone.utc)

    db.flush()
    db.refresh(item)

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
    db.refresh(queue_item)

    audit_queue_action(
        db,
        AuditAction.QUEUE_UPDATED,
        queue_item,
        operator_id,
        f"mark_attempted_verification: user_id={queue_item.user_id}",
    )
    return queue_item
