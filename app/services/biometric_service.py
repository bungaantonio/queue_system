from sqlalchemy.orm import Session
from app.crud import biometric_crud
from app.services import audit_service, queue_service
from app.exceptions.exceptions import BiometricException, QueueException
from app.helpers import biometric_helpers


# ------------------ REGISTER BIOMETRIC ------------------
def register_biometric(
    db: Session, user_id: int, template: str, hash: str, finger_index: int
):
    return biometric_crud.create_biometric(db, user_id, template, hash, finger_index)


# ------------------ VERIFY USER ------------------
def verify_called_user(db: Session, user_id: int, template: str) -> dict:
    """
    Orquestra a verificação biométrica do usuário chamado.
    """
    bio = biometric_crud.get_by_user(db, user_id)
    if not bio:
        raise BiometricException("user_no_biometric")

    # Validação biométrica
    try:
        biometric_helpers.validate_biometric(template, bio)
    except BiometricException:
        queue_service.mark_attempted_verification(db, user_id)
        raise

    # Atualizar status da fila
    queue_item = queue_service.promote_to_being_served(db, user_id)

    # Auditoria
    audit_service.log_action(
        db,
        action="QUEUE_VERIFIED",
        user_id=user_id,
        queue_item_id=queue_item.id,
        biometric_id=bio.id,
        details="Usuário autenticado e em atendimento",
    )

    return {"user_id": user_id, "verified": True, "message": "Usuário autenticado"}
