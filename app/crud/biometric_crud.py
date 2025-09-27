from typing import Optional, Sequence
from sqlalchemy.orm import Session
from app.models.biometric import Biometric


def create_biometric(
    db: Session, user_id: int, template: str, hash: str, finger_index: int
) -> Biometric:
    biometric = Biometric(
        user_id=user_id,
        template=template,
        hash=hash,
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


def get_by_template(db: Session, template: str) -> Optional[Biometric]:
    return db.query(Biometric).filter(Biometric.template == template).first()
