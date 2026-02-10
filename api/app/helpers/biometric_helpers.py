# app/helpers/biometric_validator.py
from sqlalchemy.orm import Session
from app.crud.biometric import get_by_biometric_id
from app.models.biometric import Biometric
from app.exceptions.exceptions import CredentialException


def validate_biometric(template: str, bio: Biometric) -> None:
    """
    Valida se o template fornecido corresponde ao armazenado.
    Lança BiometricException se não bater.
    """
    if bio.template != template:
        raise CredentialException("biometric_mismatch")


def identify_user(db: Session, biometric_id: str) -> int:
    bio = get_by_biometric_id(db, biometric_id)
    if not bio:
        raise CredentialException("biometric_not_found")
    return bio.user_id
