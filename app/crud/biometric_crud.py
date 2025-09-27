from typing import Optional, Sequence
from sqlalchemy.orm import Session
from app.exceptions.exceptions import BiometricException
from app.models.biometric import Biometric


def create_biometric(
    db: Session, user_id: int, biometric_id: str, finger_index: int
) -> Biometric:
    existing = (
        db.query(Biometric).filter(Biometric.biometric_id == biometric_id).first()
    )
    if existing:
        raise BiometricException("biometric_already_registered")

    biometric = Biometric(
        user_id=user_id,
        biometric_id=biometric_id,
        finger_index=finger_index,
    )
    db.add(biometric)
    db.commit()
    db.refresh(biometric)
    return biometric


def get_all_by_user(db: Session, user_id: int) -> Sequence[Biometric]:
    return db.query(Biometric).filter(Biometric.user_id == user_id).all()


def get_by_user(db: Session, user_id: int) -> Optional[Biometric]:
    return db.query(Biometric).filter(Biometric.user_id == user_id).first()


def get_by_biometric_id(db: Session, biometric_id: str) -> Optional[Biometric]:
    return db.query(Biometric).filter(Biometric.biometric_id == biometric_id).first()
