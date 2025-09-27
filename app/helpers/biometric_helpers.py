# app/helpers/biometric_validator.py
from sqlalchemy.orm import Session
from app.crud import biometric_crud
from app.models.biometric import Biometric
from app.exceptions.exceptions import BiometricException


def validate_biometric(template: str, bio: Biometric) -> None:
    """
    Valida se o template fornecido corresponde ao armazenado.
    Lança BiometricException se não bater.
    """
    if bio.template != template:
        raise BiometricException("biometric_mismatch")


def identify_user(db: Session, biometric_id: str) -> int:
    bio = biometric_crud.get_by_biometric_id(db, biometric_id)
    if not bio:
        raise BiometricException("biometric_not_found")
    return bio.user_id
