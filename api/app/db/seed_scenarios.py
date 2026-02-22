from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.scenario import Scenario


DEFAULT_SCENARIOS = [
    ("PRODUCAO", "Produção"),
    ("CENARIO_A", "Cenário_A"),
    ("CENARIO_B", "Cenário_B"),
]


def bootstrap_scenarios() -> None:
    db: Session = SessionLocal()
    try:
        for code, name in DEFAULT_SCENARIOS:
            existing = db.query(Scenario).filter(Scenario.code == code).first()
            if existing:
                continue
            db.add(Scenario(code=code, name=name, is_active=True))
        db.commit()
    finally:
        db.close()

