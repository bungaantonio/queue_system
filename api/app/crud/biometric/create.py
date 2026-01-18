from sqlalchemy.orm import Session
from app.exceptions.exceptions import BiometricException
from app.models.biometric import Biometric


def create_biometric(db: Session, user_id: int, biometric_id: str) -> Biometric:
    existing = (
        db.query(Biometric).filter(Biometric.biometric_id == biometric_id).first()
    )
    if existing:
        raise BiometricException("biometric_already_registered")

    biometric = Biometric(
        user_id=user_id,
        biometric_id=biometric_id,
    )
    db.add(biometric)
    db.flush()
    return biometric
