# app/services/auth_provider.py
from sqlalchemy.orm import Session
from app.models.user_credential import UserCredential
from app.utils.credential_utils import compute_server_hash, secure_compare


class AuthenticationProvider:
    @staticmethod
    def verify(db: Session, user_id: int, auth_type: str, presented_data: str) -> bool:
        # Busca todas as credenciais desse utilizador para o tipo solicitado
        creds = (
            db.query(UserCredential)
            .filter(
                UserCredential.user_id == user_id, UserCredential.cred_type == auth_type
            )
            .all()
        )

        for cred in creds:
            if auth_type == "zkteco":
                # O middleware envia o ID puro, nós hashamos para comparar com o banco
                hashed_input = compute_server_hash(presented_data)
                if secure_compare(hashed_input, cred.identifier):
                    return True

            elif auth_type == "webauthn":
                # Lógica de validação de assinatura WebAuthn (PyWebAuthn)
                if verify_webauthn_signature(presented_data, cred.identifier):
                    return True

        return False
