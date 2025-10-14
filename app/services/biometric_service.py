from sqlalchemy.orm import Session
from app.crud import biometric_crud, queue_crud
from app.exceptions.exceptions import BiometricException
from app.schemas.biometric_schema import BiometricVerifyResponse
from app.services.audit_service import AuditService


def verify_called_user(
    db: Session, queue_id: int, biometric_id: str
) -> BiometricVerifyResponse:
    """
    Verifica a biometria do usuário que foi chamado para atendimento.
    Só permite autenticar o usuário que está em 'called_pending_verification'.
    """
    # Pega o item atualmente chamado para verificação
    current_called = queue_crud.get_pending_verification_item(db)
    if not current_called:
        raise BiometricException("user_not_called_in_queue")

    # Garante que o queue_id enviado corresponde ao item chamado
    if current_called.id != queue_id:
        raise BiometricException("biometric_mismatch")

    user_id = current_called.user_id

    # Recupera a biometria cadastrada
    bio = biometric_crud.get_by_user(db, user_id)
    if not bio:
        raise BiometricException("user_no_biometric")

    # Verifica se a biometria capturada bate
    if bio.biometric_id != biometric_id:
        # Marca tentativa falha
        queue_crud.mark_as_called(db, current_called)
        raise BiometricException("biometric_mismatch")

    # Atualiza fila para "being_served"
    queue_item = queue_crud.mark_as_being_served(db, current_called)

    # Auditoria
    AuditService.log_action(
        db,
        action="QUEUE_VERIFIED",
        user_id=user_id,
        queue_item_id=queue_item.id,
        biometric_id=bio.id,
        details="Usuário autenticado e em atendimento",
    )

    return BiometricVerifyResponse(
        user_id=user_id,
        verified=True,
        message="Usuário autenticado com sucesso",
        score=None,
    )
