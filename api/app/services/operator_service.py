from typing import List, Optional, cast
from sqlalchemy.orm import Session
from app.core.exceptions import AppException
from app.helpers.password import get_password_hash
from app.helpers.audit_helpers import (
    audit_operator_created,
    audit_operator_updated,
    audit_operator_activated,
    audit_operator_deactivated,
    audit_operator_deleted,
)
from app.crud import operator_crud
from app.models.models import RefreshToken
from app.schemas.operator_schemas import (
    OperatorResponse,
    OperatorCreateRequest,
    OperatorUpdateRequest,
)


class OperatorService:
    @staticmethod
    def create_operator(
        db: Session,
        operator_in: OperatorCreateRequest,
        acting_operator_id: Optional[int] = None,
    ) -> OperatorResponse:
        # 1. Hashing da senha
        hashed = get_password_hash(operator_in.password)

        # 2. CRUD
        new_op = operator_crud.create_operator_record(
            db, operator_in.username, hashed, operator_in.role
        )

        # 3. Auditoria (Se for seed, o acting_operator_id pode ser o ID do próprio novo admin)
        audit_operator_created(
            db=db,
            actor_operator_id=acting_operator_id or cast(int, new_op.id),
            target_operator_id=cast(int, new_op.id),
            username=cast(str, new_op.username),
            role=cast(str, new_op.role),
        )

        db.commit()
        db.refresh(new_op)
        return OperatorResponse.model_validate(new_op)

    @staticmethod
    def update_operator(
        db: Session,
        operator_id: int,
        operator_in: OperatorUpdateRequest,
        acting_operator_id: int,
    ) -> Optional[OperatorResponse]:
        db_op = operator_crud.get_operator_by_id(db, operator_id)
        if not db_op:
            return None

        update_data = operator_in.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(
                update_data.pop("password")
            )

        for field, value in update_data.items():
            setattr(db_op, field, value)

        operator_crud.update_operator_record(db, db_op)

        audit_operator_updated(
            db=db,
            actor_operator_id=acting_operator_id,
            target_operator_id=cast(int, db_op.id),
            updated_fields=list(update_data.keys()),
        )

        db.commit()
        db.refresh(db_op)
        return OperatorResponse.model_validate(db_op)

    @staticmethod
    def deactivate_operator(
        db: Session, operator_id: int, acting_operator_id: int
    ) -> Optional[OperatorResponse]:
        db_op = operator_crud.get_operator_by_id(db, operator_id)
        if not db_op:
            return None
        if not cast(bool, db_op.active):
            return OperatorResponse.model_validate(db_op)

        db_op.active = False
        operator_crud.update_operator_record(db, db_op)

        audit_operator_deactivated(
            db=db,
            actor_operator_id=acting_operator_id,
            target_operator_id=cast(int, db_op.id),
            username=cast(str, db_op.username),
        )

        db.commit()
        db.refresh(db_op)
        return OperatorResponse.model_validate(db_op)

    @staticmethod
    def activate_operator(
        db: Session, operator_id: int, acting_operator_id: int
    ) -> Optional[OperatorResponse]:
        db_op = operator_crud.get_operator_by_id(db, operator_id)
        if not db_op:
            return None
        if cast(bool, db_op.active):
            return OperatorResponse.model_validate(db_op)

        db_op.active = True
        operator_crud.update_operator_record(db, db_op)

        audit_operator_activated(
            db=db,
            actor_operator_id=acting_operator_id,
            target_operator_id=cast(int, db_op.id),
            username=cast(str, db_op.username),
        )

        db.commit()
        db.refresh(db_op)
        return OperatorResponse.model_validate(db_op)

    @staticmethod
    def delete_operator(
        db: Session, operator_id: int, acting_operator_id: int
    ) -> Optional[OperatorResponse]:
        if operator_id == acting_operator_id:
            raise AppException("operator.self_delete_forbidden")

        db_op = operator_crud.get_operator_by_id(db, operator_id)
        if not db_op:
            return None

        deleted_snapshot = OperatorResponse.model_validate(db_op)

        audit_operator_deleted(
            db=db,
            actor_operator_id=acting_operator_id,
            target_operator_id=cast(int, db_op.id),
            username=cast(str, db_op.username),
        )

        db.query(RefreshToken).filter(
            RefreshToken.user_id == cast(int, db_op.id)
        ).delete(synchronize_session=False)
        db.delete(db_op)

        db.commit()
        return deleted_snapshot

    @staticmethod
    def get_by_id(db: Session, operator_id: int) -> Optional[OperatorResponse]:
        op = operator_crud.get_operator_by_id(db, operator_id)
        return OperatorResponse.model_validate(op) if op else None

    @staticmethod
    def get_all(db: Session) -> List[OperatorResponse]:
        operators = operator_crud.get_all_operators(db)
        return [OperatorResponse.model_validate(op) for op in operators]
