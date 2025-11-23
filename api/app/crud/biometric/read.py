# app/crud/biometric_crud.py
from sqlalchemy.orm import Session
from app.models.biometric import Biometric
from app.models.enums import QueueStatus
from app.models.queue_item import QueueItem


def get_called_pending_by_queue_item_id(
    db: Session, queue_item_id: int
) -> QueueItem | None:
    """Busca um QueueItem pelo id do item, somente se estiver CALLED_PENDING."""
    return (
        db.query(QueueItem)
        .filter(
            QueueItem.id == queue_item_id,
            QueueItem.status == QueueStatus.CALLED_PENDING,
        )
        .first()
    )


def get_by_biometric_id(db: Session, biometric_id: str) -> Biometric | None:
    """
    Busca um registro biométrico pelo seu ID único.

    Args:
        db (Session): Sessão do banco de dados.
        biometric_id (str): ID da biometria.

    Returns:
        Biometric | None: O objeto Biometric correspondente ou None se não encontrado.

    Exemplo:
        bio = get_by_biometric_id(db, "abc123")
        if bio:
            print(bio.user_id)
    """
    return db.query(Biometric).filter(Biometric.biometric_id == biometric_id).first()


def get_first_biometric_by_user(db: Session, user_id: int) -> Biometric | None:
    """
    Retorna o **primeiro registro biométrico** de um usuário, caso exista.

    Args:
        db (Session): Sessão do banco de dados.
        user_id (int): ID do usuário.

    Returns:
        Biometric | None: O primeiro registro biométrico do usuário ou None se não houver.

    Exemplo:
        bio = get_first_biometric_by_user(db, 42)
        if bio:
            print(bio.biometric_id)
    """
    return db.query(Biometric).filter(Biometric.user_id == user_id).first()
