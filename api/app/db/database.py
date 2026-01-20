from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Força str para satisfazer Pylance
engine = create_engine(str(settings.DATABASE_URL), echo=True, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependência do FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
