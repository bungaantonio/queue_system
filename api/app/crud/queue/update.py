# app/crud/queue/update.py
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.crud.queue.read import get_next_position
from app.models.enums import QueueStatus
from app.models.queue_item import QueueItem
from app.models.user_credential import UserCredential
from app.utils import credential_utils


def set_priority(db: Session, item: QueueItem, new_priority: int) -> QueueItem:
    """Atualiza diretamente a prioridade de um item. Não commit nem auditoria."""
    item.priority_score = new_priority
    db.flush()
    return item


def set_position(db: Session, item: QueueItem, new_position: int) -> QueueItem:
    """Move item para nova posição, ajustando outros itens ativos."""
    old_position = item.position
    if old_position == new_position:
        return item

    active_statuses = [QueueStatus.WAITING, QueueStatus.CALLED_PENDING]

    if new_position < old_position:
        # sobe o item: empurra os acima uma posição abaixo
        db.query(QueueItem).filter(
            QueueItem.position >= new_position,
            QueueItem.position < old_position,
            QueueItem.status.in_(active_statuses)
        ).update({QueueItem.position: QueueItem.position + 1}, synchronize_session="fetch")
    else:
        # desce o item: puxa os abaixo uma posição acima
        db.query(QueueItem).filter(
            QueueItem.position <= new_position,
            QueueItem.position > old_position,
            QueueItem.status.in_(active_statuses)
        ).update({QueueItem.position: QueueItem.position - 1}, synchronize_session="fetch")

    item.position = new_position
    db.flush()
    return item


def mark_as_called(db: Session, item: QueueItem) -> QueueItem:
    """
    Marca o usuário como chamado e gera os tokens de sessão.
    """
    old_status = item.status
    item.status = QueueStatus.CALLED_PENDING
    item.attempted_verification = False
    item.timestamp = datetime.now(timezone.utc)

    # 1. Gerar Call Token (Obrigatório para a sessão de atendimento)
    # Usando o nome correto da função em utils.py
    item.call_token, item.call_token_expires_at = credential_utils.generate_call_token()

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
    return item


def mark_as_done(db: Session, item: QueueItem) -> QueueItem:
    old_status = item.status
    item.status = QueueStatus.DONE
    item.timestamp = datetime.now(timezone.utc)

    db.flush()
    return item


def mark_as_cancelled(db: Session, item: QueueItem) -> QueueItem:
    """
    Marca o item como CANCELLED e ajusta as posições subsequentes de forma transacional.
    """
    old_position = item.position
    old_status = item.status

    item.status = QueueStatus.CANCELLED

    # Ajusta posições de forma segura
    db.query(QueueItem).filter(
        QueueItem.position > old_position,
        QueueItem.status.in_([QueueStatus.WAITING, QueueStatus.CALLED_PENDING]),
    ).update(
        {QueueItem.position: QueueItem.position - 1},
        synchronize_session="fetch",
    )

    db.flush()
    return item


def mark_as_skipped(
        db: Session,
        item: QueueItem,
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
    return item


def mark_attempted_verification(db: Session, queue_item: QueueItem) -> QueueItem:
    """
    Marca que o usuário tentou a verificação biométrica.
    """
    queue_item.attempted_verification = True

    db.flush()
    return queue_item
