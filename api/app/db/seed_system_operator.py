from app.db.database import SessionLocal
from app.crud import operator_crud
from app.services.operator_service import OperatorService
from app.models.enums import OperatorRole
from app.core.config import settings
from app.schemas.operator_schemas import OperatorCreateRequest


def ensure_operator(username: str, password_raw: str, role: OperatorRole):
    db = SessionLocal()
    try:
        existing = operator_crud.get_operator_by_username(db, username)
        if existing:
            return existing

        # Criamos o schema de request para passar ao serviço
        request = OperatorCreateRequest(
            username=username, password=password_raw, role=role  # Senha Pura
        )

        # O serviço cuidará do Hashing, Auditoria e Commit
        new_op = OperatorService.create_operator(db, request)
        print(f"Seed: Operator {username} created (id={new_op.id})")
        return new_op
    except Exception as e:
        db.rollback()
        print(f"Seed Error for {username}: {e}")
    finally:
        db.close()


def bootstrap_system_operators():
    # Admin Padrão
    ensure_operator(
        settings.DEFAULT_ADMIN_USERNAME,
        str(settings.DEFAULT_ADMIN_PASSWORD),
        OperatorRole.ADMIN,
    )
    # Gateway do Sistema
    ensure_operator(
        settings.SYSTEM_OPERATOR_USERNAME,
        str(settings.SYSTEM_OPERATOR_PASSWORD),
        OperatorRole.SYSTEM,
    )


if __name__ == "__main__":
    bootstrap_system_operators()
