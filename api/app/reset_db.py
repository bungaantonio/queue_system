from app.db.base import Base
from app.db.database import engine


def reset_db():
    print("⚠️ Resetando o banco...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("✅ Banco recriado com sucesso!")


if __name__ == "__main__":
    reset_db()


# To run this script, use the command:
# python reset_db.py
